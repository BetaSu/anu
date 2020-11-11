import { requestHostCallback, shouldYield } from './hostConfig';

const taskQueue = [];

const workLoop = () => {
  const firstTask = taskQueue[0];
  if (!firstTask) {
    return;
  }
  requestHostCallback(firstTask.callback, continuationCallback => {
    taskQueue.shift();
    if (typeof continuationCallback === 'function') {
      firstTask.callback = continuationCallback;
      taskQueue.unshift(firstTask);
    }
    workLoop();
  });
}

const scheduleCallback = callback => {
  const task = {
    callback
  };

  taskQueue.push(task);
  workLoop();
}

export {
  scheduleCallback,
  shouldYield
};