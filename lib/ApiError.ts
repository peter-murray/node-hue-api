import { HueError } from './HueError';

export class ApiError extends Error {

  private readonly _hueError?: HueError;

  constructor(message: string | HueError, error?: HueError) {
    if (message instanceof HueError) {
      super(message.message);
      this._hueError = message || error;
    } else {
      super(message);
      this._hueError = error;
    }

    Error.captureStackTrace(this, ApiError);
  }

  getHueError(): HueError | undefined {
    return this._hueError;
  }

  getHueErrorType(): number {
    return this._hueError ? this._hueError.type : -1;
  }

  getHueErrorAddress(): string | undefined {
    return this._hueError ? this._hueError.address : undefined;
  }

  getHueErrorDescription(): string | undefined {
    return this._hueError ? this._hueError.description : undefined;
  }

  getHueErrorMessage(): string | undefined {
    return this._hueError ? this._hueError.message : undefined;
  }
}