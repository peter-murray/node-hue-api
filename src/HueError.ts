//TODO create wrapper types
export const ERROR_TYPES = {
  1: 'unauthorized user',
  2: 'body contains invalid JSON',
  3: 'resource not found',
  4: 'method not available for resource',
  5: 'missing parameters in body',
  6: 'parameter not available',
  7: 'invalid value for parameter',
  8: 'parameter not modifiable',
  11: 'too many items in list',
  12: 'portal connection is required',
  901: 'bridge internal error',
}

export type HueErrorPayload = {
  type?: number,
  address?: string,
  description?: string,
  message?: string,
}

export class HueError {

  private readonly payload: HueErrorPayload;

  constructor(payload: HueErrorPayload) {
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
    let str = this.payload.message
      , type = this.type
    ;

    if (type === 5 || type === 6) {
      // The address makes the error more meaningful
      str = `${str}: ${this.address}`;
    }

    return str;
  }

  get rawError(): HueErrorPayload {
    return this.payload;
  }
}