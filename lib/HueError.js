'use strict';

class HueError {

  constructor(payload) {
    this.payload = payload;
  }

  get type() {
    return this.payload.type || -1;
  }

  get address() {
    return this.payload.address;
  }

  get description() {
    return this.payload.description;
  }

  get message() {
    return this.payload.message;
  }

  get rawError() {
    return this.payload;
  }
}

module.exports = HueError;