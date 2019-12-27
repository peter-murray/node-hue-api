'use strict';

const HueError = require('./HueError');

class ApiError extends Error {

  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ApiError);

    //TODO need handling of the Phillips Hue error types as leaving necessary information behind
    // let errorMessage
    //   , errorType;
    //
    // if (typeof (error) === 'string') {
    //   errorMessage = error;
    //   errorType = 0;
    // } else {
    //   //TODO add better handling for hue error types
    //   errorMessage = error.message || error.description;
    //   errorType = error.type;
    // }
    // this.type = errorType;

    if (args[0] instanceof HueError) {
      this._hueError = args[0];
      this.message = this._hueError.message;
    } else if (args[1] && args[1] instanceof HueError) {
      this._hueError = args[1];
    }
  }

  getHueError() {
    return this._hueError;
  }

  /**
   * @returns {number}
   */
  getHueErrorType() {
    return this._hueError ? this._hueError.type : -1;
  }

  /**
   * @returns {string | null}
   */
  getHueErrorAddress() {
    return this._hueError ? this._hueError.address : null;
  }

  /**
   * @returns {string | null}
   */
  getHueErrorDescription() {
    return this._hueError ? this._hueError.description : null;
  }

  /**
   * @returns {string | null}
   */
  getHueErrorMessage() {
    return this._hueError ? this._hueError.message : null;
  }
}

module.exports = ApiError;