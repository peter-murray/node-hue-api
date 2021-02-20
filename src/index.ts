//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

import * as discovery from './api/discovery';
export { discovery };

import { ApiError } from './ApiError';
export { ApiError };

export * from './v3';

// TODO decide if this is where it should be exposed, or do we want to encapsulate in side another file?
export { model, time } from '@peter-murray/hue-bridge-model';