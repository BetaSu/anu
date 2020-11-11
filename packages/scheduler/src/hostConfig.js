// 时间切片时长
let yieldInterval = 5;
let deadline = 0;

export function getCurrentTime() {
  if (performance.now) {
    return performance.now();
  }
  return Date.now();
}

export function shouldYield() {
  const now = getCurrentTime();
  return now - deadline >= yieldInterval;
}

export let requestHostCallback;

if (typeof window === 'undefined' || typeof MessageChannel !== 'function') {

  requestHostCallback = (fn, callback) => {
    const now = getCurrentTime();
    deadline = now + yieldInterval;
    setTimeout(() => {
      let result;
      try {
        result = fn();
      } catch(e) {
        throw e;
      } finally {
        callback && callback(result);
      }
    });
  }
} else {

  const performWorkUntilDeadline = () => {
    if (!callbackData) {
      return;
    }
    const {callback, fn} = callbackData;
    const now = getCurrentTime();
    deadline = now + yieldInterval;
    let result;

    try {
      result = fn();
    } catch(e) {
      throw e;
    } finally {
      isMessageLoopRunning = false;
      callbackData = null;
      callback && callback(result);
    }
  };

  let isMessageLoopRunning = false;
  let callbackData = null;
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  
  requestHostCallback = function(fn, callback) {
    if (!isMessageLoopRunning) {
      callbackData = {fn, callback};
      isMessageLoopRunning = true;
      port.postMessage(null);
    }
  };
}
