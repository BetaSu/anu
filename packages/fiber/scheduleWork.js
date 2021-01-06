import { performUnitOfWork } from './beginWork';
import { commitDFS } from './commitWork';
import { Renderer } from 'react-core/createRenderer';
import {
    effects,
    resetStack,
    get,
    isFn,
    topNodes,
    typeNumber,
    topFibers
} from 'react-core/util';
import { Unbatch } from './unbatch';
import { Fiber } from './Fiber';

import { createInstance } from './createInstance';
import { 
    shouldYield,
    scheduleCallback,
    runWithPriority,
    getCurrentPriority,
    ASYNC_PRIORITY,
    SYNC_PRIORITY 
} from '../scheduler/src/scheduler';

const macrotasks = Renderer.macrotasks;
let boundaries = Renderer.boundaries;
const batchedtasks = [];

// 当前正在render阶段的fiber，workInProgress简写
let wip = null;
// 保存render阶段执行过程中的栈信息
let stackInfo;

export function render(vnode, root, callback) {
    let container = createContainer(root),
        immediateUpdate = false;
    if (!container.hostRoot) {
        let fiber = new Fiber({
            type: Unbatch,
            tag: 2,
            props: {},
            hasMounted: true,
            memoizedState: {},
            return: container
        });
        fiber.index = 0;
        container.child = fiber;
        //将updateClassComponent部分逻辑放到这里，我们只需要实例化它
        let instance = createInstance(fiber, {});
        container.hostRoot = instance;
        immediateUpdate = true;
        Renderer.emptyElement(container);
    }
    let carrier = {};
    updateComponent(
        container.child,
        {
            child: vnode
        },
        wrapCb(callback, carrier),
        immediateUpdate
    );

    return carrier.instance;
}

function wrapCb(fn, carrier) {
    return function() {
        let fiber = get(this);
        let target = fiber.child ? fiber.child.stateNode : null;
        fn && fn.call(target);
        carrier.instance = target;
    };
}

//如果更新过程中产生新的任务（setState与gDSFP），它们会放到每棵树的microtasks
//我们需要再做一次收集，不为空时，递归调用
function collectTask() {
    if (boundaries.length) {
        //优先处理异常边界的setState
        macrotasks.unshift.apply(macrotasks, boundaries);
        boundaries.length = 0;
    }
    topFibers.forEach(function(el) {
        let microtasks = el.microtasks;
        while ((el = microtasks.shift())) {
            if (!el.disposed) {
                macrotasks.push(el);
            }
        }
    })
}


Renderer.scheduleWork = () => {
    const schedulerTask = performWork();

    // 没有被调度的任务时，收集任务后重新调度
    if (!schedulerTask) {
        collectTask();
        if (macrotasks.length) {
            Renderer.scheduleWork();
        }
    }
};

let isBatching = false;

Renderer.batchedUpdates = function(callback, event) {
    let keepbook = isBatching;
    isBatching = true;
    try {
        event && Renderer.fireMiddlewares(true);
        return callback(event);
    } finally {
        isBatching = keepbook;
        if (!isBatching) {
            let el;
            while ((el = batchedtasks.shift())) {
                if (!el.disabled) {
                    macrotasks.push(el);
                }
            }
            Renderer.scheduleWork();
            event && Renderer.fireMiddlewares();
        }
    }
};



function workLoopConcurrent() {
    while (wip && !shouldYield()) {
        wip = performUnitOfWork(wip, stackInfo);
    }
}

function workLoopSync() {
    while (wip) {
        wip = performUnitOfWork(wip, stackInfo);
    }
}

function performWork() {
    if (!wip) {
        wip = macrotasks.shift();
        if (wip) {
            // 开始本轮render阶段
            if (wip.type === Unbatch) {
                stackInfo = wip.return;
            } else {
                let dom = getContainer(wip);
                stackInfo = {
                    containerStack: [dom],
                    contextStack: [wip.stateNode.__unmaskedContext]
                };
            }
        } else {
            return null;
        } 
    }

    const schedulerPriority = getCurrentPriority();

    return scheduleCallback(schedulerPriority, () => {
        const concurrentMode = false;
        const workLoop = concurrentMode ? workLoopConcurrent : workLoopSync;
        workLoop();

        if (!wip) {
            resetStack(stackInfo);
            if (!macrotasks.length) {
                // 执行任务
                commitDFS(effects); 
                collectTask();
            } 
            Renderer.scheduleWork();
        } else {
            // 时间切片中断后重新开始
            return performWork;
        }
    }) 
}


/**
 * 这是一个深度优先过程，beginWork之后，对其孩子进行任务收集，然后再对其兄弟进行类似操作，
 * 没有，则找其父节点的孩子
 * @param {Fiber} fiber
 * @param {Fiber} topWork
 */

function mergeUpdates(fiber, state, isForced, callback) {
    let updateQueue = fiber.updateQueue;
    if (isForced) {
        updateQueue.isForced = true; // 如果是true就变不回false
    }
    if (state) {
        updateQueue.pendingStates.push(state);
    }
    if (isFn(callback)) {
        updateQueue.pendingCbs.push(callback);
    }
}

function fiberContains(p, son) {
    while (son.return) {
        if (son.return === p) {
            return true;
        }
        son = son.return;
    }
}

function getQueue(fiber) {
    while (fiber) {
        if (fiber.microtasks) {
            return fiber.microtasks;
        }
        fiber = fiber.return;
    }
}

function pushChildQueue(fiber, queue) {
    //判定当前节点是否包含已进队的节点
    let maps = {};
    for (let i = queue.length, el; (el = queue[--i]); ) {
        //移除列队中比它小的组件
        if (fiber === el) {
            queue.splice(i, 1); //已经放进过，去掉
            continue;
        } else if (fiberContains(fiber, el)) {
            //不包含自身
            queue.splice(i, 1);
            continue;
        }
        maps[el.stateNode.updater.mountOrder] = true;
    }
    let enqueue = true,
        p = fiber,
        hackSCU = [];
    while (p.return) {
        p = p.return;
        var instance = p.stateNode;
        if (instance.refs && !instance.__isStateless && p.type !== Unbatch) {
            hackSCU.push(p);
            var u = instance.updater;
            if (maps[u.mountOrder]) {
                //它是已经在列队的某个组件的孩子
                enqueue = false;
                break;
            }
        }
    }
    hackSCU.forEach(function(el) {
        //如果是批量更新，必须强制更新，防止进入SCU
        el.updateQueue.batching = true;
    });
    if (enqueue) {
        queue.push(fiber);
    }
}
//setState的实现
function updateComponent(fiber, state, callback, immediateUpdate) {
    fiber.dirty = true;

    let sn = typeNumber(state);
    let isForced = state === true;
    let microtasks = getQueue(fiber);

    state = isForced ? null : sn === 5 || sn === 8 ? state : null;
    if (fiber.setout) {
        // cWM/cWRP中setState， 不放进列队
        immediateUpdate = false;
    } else if ((isBatching && !immediateUpdate) || fiber._hydrating) {
        //事件回调，batchedUpdates, 错误边界, cDM/cDU中setState
        pushChildQueue(fiber, batchedtasks);
    } else {
        //情况4，在钩子外setState或batchedUpdates中ReactDOM.render一棵新树
        immediateUpdate = immediateUpdate || !fiber._hydrating;
        pushChildQueue(fiber, microtasks);
    }
    mergeUpdates(fiber, state, isForced, callback);
    if (immediateUpdate) {
        runWithPriority(SYNC_PRIORITY, Renderer.scheduleWork);
    }
}

Renderer.updateComponent = updateComponent;

function validateTag(el) {
    return el && el.appendChild;
}
export function createContainer(root, onlyGet, validate) {
    validate = validate || validateTag;
    if (!validate(root)) {
        throw `container is not a element`; // eslint-disable-line
    }

    root.anuProp = 2018;
    let useProp = root.anuProp === 2018;
    //像IE6-8，文本节点不能添加属性
    if (useProp) {
        root.anuProp = void 0;
        if (get(root)) {
            return get(root);
        }
    } else {
        let index = topNodes.indexOf(root);
        if (index !== -1) {
            return topFibers[index];
        }
    }
    if (onlyGet) {
        return null;
    }
    let container = new Fiber({
        stateNode: root,
        tag: 5,
        name: 'hostRoot',
        //contextStack的对象 总是它的后面的元素的并集 ［dUcUbUa, cUbUa, bUa, a, {}］
        contextStack: [{}],
        containerStack: [root],
        microtasks: [],
        type: root.nodeName || root.type
    });
    if (useProp) {
        root._reactInternalFiber = container;
    }
    topNodes.push(root);
    topFibers.push(container);

    return container;
}

export function getContainer(p) {
    if (p.parent) {
        return p.parent;
    }
    while ((p = p.return)) {
        if (p.tag === 5) {
            return p.stateNode;
        }
    }
}
