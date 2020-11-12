import { requestHostCallback, shouldYield } from './hostConfig';

const taskQueue = [];
const SYNC_PRIORITY = 0;
const ASYNC_PRIORITY = 1;
let curPriority = ASYNC_PRIORITY;

const workLoop = () => {
  const firstTask = taskQueue[0];
  if (!firstTask) {
    return;
  }

  const {priority, callback} = firstTask;

  if (priority === SYNC_PRIORITY) {
    let result;
    try {
      result = callback();
    } catch(e) {
      throw e;
    } finally {
      return onTaskComplete(result);
    }
  }

  requestHostCallback(callback, continuationCallback => {
    onTaskComplete(continuationCallback);
  });
}

function onTaskComplete(continuationCallback) {
  taskQueue.shift();
  if (typeof continuationCallback === 'function') {
    firstTask.callback = continuationCallback;
    taskQueue.unshift(firstTask);
  }
  workLoop();
}

const scheduleCallback = (priority, callback) => {
  const task = {
    callback,
    priority
  };

  taskQueue.push(task);
  workLoop();
  return task;
}

const runWithPriority = (priority, callback) => {
  const prevPriority = curPriority;
  curPriority = priority;
  try {
    callback();
  } finally {
    curPriority = prevPriority;
  }
}

const getCurrentPriority = () => {
  return curPriority;
}

export {
  scheduleCallback,
  shouldYield,
  runWithPriority,
  getCurrentPriority,
  SYNC_PRIORITY,
  ASYNC_PRIORITY
};