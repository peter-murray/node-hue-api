import Bottleneck from 'bottleneck';
import { RateLimit } from './HueApiRateLimits';
import { HueApiRateLimitLogger } from './HueApiRateLimitLogger';

export class HueRateLimiter {

  private readonly limiterName: string;

  private readonly bottleneck: Bottleneck;

  private id: number = 0;

  constructor(bridgeName: string, name: string, rateLimit: RateLimit) {
    this.limiterName = `${bridgeName.trim().length > 0 ? bridgeName : 'node-hue-api'}:${name}`;
    this.bottleneck = new Bottleneck(rateLimit || undefined);

    HueApiRateLimitLogger.install(name, this.bottleneck);
  }

  schedule(fn: () => PromiseLike<any>): Promise<any> {
    const jobId = this.id++;
    return this.bottleneck.schedule({id: `${this.limiterName}:${jobId}`}, fn);
  }
}