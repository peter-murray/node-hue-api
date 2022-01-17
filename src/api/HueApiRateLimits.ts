export type RateLimit = {
  maxConcurrent: number,
  minTime: number,
}

// Set up a limiter on the group state changes from the library to once per second as per guidance documentation
const DEFAULT_GROUP_RATE_LIMITS: RateLimit = {
  maxConcurrent: 1,
  minTime: 1000 // how long to wait before launching another request in ms
}

// As per Bridge documentation guidance, limit the number of calls to the light state changes to 10 per second max
const DEFAULT_LIGHT_RATE_LIMITS: RateLimit = {
  maxConcurrent: 1,
  minTime: 60 // how long to wait before launching another request in ms
}

// Limiting the general rate limits across the API to a hue bridge
const DEFAULT_RATE_LIMITS: RateLimit = {
  maxConcurrent: 4,
  minTime: 50 // how long to wait before launching another request in ms
}

export type RateLimits = {
  transport?: RateLimit,
  group?: RateLimit,
  light?: RateLimit,
}

export class HueApiRateLimits {

  private _rateLimits: RateLimits;

  constructor(rateLimits?: RateLimits) {
    if (rateLimits) {
      this._rateLimits = {
        transport: rateLimits.transport || DEFAULT_RATE_LIMITS,
        group: rateLimits.group || DEFAULT_GROUP_RATE_LIMITS,
        light: rateLimits.light || DEFAULT_LIGHT_RATE_LIMITS
      }
    } else {
      this._rateLimits = {
        transport: DEFAULT_RATE_LIMITS,
        group: DEFAULT_GROUP_RATE_LIMITS,
        light: DEFAULT_LIGHT_RATE_LIMITS,
      }
    }
  }

  get groupRateLimit(): RateLimit {
    return this._rateLimits.group || DEFAULT_GROUP_RATE_LIMITS;
  }

  get lightRateLimit(): RateLimit {
    return this._rateLimits.light || DEFAULT_LIGHT_RATE_LIMITS;
  }

  get transportRateLimit(): RateLimit {
    return this._rateLimits.transport || DEFAULT_RATE_LIMITS;
  }
}