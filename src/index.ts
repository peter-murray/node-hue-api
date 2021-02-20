//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//
import * as discovery from './api/discovery';
export { discovery };

import { ApiError } from './ApiError';
export { ApiError };

export * from './v3';

// Exported API that v3 wraps
export * as api from './api';

// Export raw implementation of bridge model
export { model, time } from '@peter-murray/hue-bridge-model';