'use strict';

module.exports.nativePromiseOrCallback = function (promise, cb) {
  let promiseResult = promise;

  if (cb && typeof cb === 'function') {
    module.exports.resolvePromise(promise, cb);
    // Do not return the promise, as the callbacks will have forced it to resolve
    promiseResult = null;
  }

  return promiseResult;
};

/**
 * Checks the callback and if it is valid, will resolve the promise an utilize the callback to inform of results,
 * otherwise the promise is returned to the caller to chain.
 *
 * @param promise The promise being invoked
 * @param cb The callback function, which is optional
 * @returns {*} The promise if there is not a valid callback, or null, if the callback is used to resolve the promise.
 */
module.exports.promiseOrCallback = function (promise, cb) {
  const promiseResult = promise;

  if (cb && typeof cb === 'function') {
    module.exports.resolvePromise(promise, cb);
    // Do not return the promise, as the callbacks will have forced it to resolve
    return null;
  }

  return promiseResult;
};

/**
 * Terminates a promise chain and invokes a callback with the results.
 *
 * @param promise The promise to terminate
 * @param callback The callback function to invoke
 */
module.exports.resolvePromise = function (promise, callback) {
  function resolveValue(value) {
    if (callback) {
      callback(null, value);
    }
  }

  function resolveError(err) {
    if (callback) {
      callback(err, null);
    }
  }

  promise.catch(resolveError).then(resolveValue);
};


module.exports.isFunction = function (object) {
  var getClass = {}.toString;

  return object && getClass.call(object) === '[object Function]';
};