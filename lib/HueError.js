'use strict';

//TODO create wrapper types
const ERROR_TYPES = {
  1: 'unauthorized user',
  2: 'body contains invalid JSON',
  3: 'resource not found',
  4: 'method not available for resource',
  5: 'missing paramters in body',
  6: 'parameter not available',
  7: 'invalid value for parameter',
  8: 'parameter not modifiable',
  11: 'too many items in list',
  12: 'portal connection is required',
  901: 'bridge internal error',
}

class HueError {

  constructor(payload) {
    this.payload = payload;
  }

  /**
   * @returns {number}
   */
  get type() {
    return this.payload.type || -1;
  }

  /**
   * @returns {string}
   */
  get address() {
    return this.payload.address;
  }

  /**
   * @returns {string}
   */
  get description() {
    return this.payload.description;
  }

  /**
   * @returns {string}
   */
  get message() {
    let str = this.payload.message
      , type = this.type
    ;

    if (type === 5 || type === 6) {
      // The address makes the error more meaningful
      str = `${str}: ${this.address}`;
    }

    return str;
  }

  /**
   * @returns {*}
   */
  get rawError() {
    return this.payload;
  }
}

module.exports = HueError;