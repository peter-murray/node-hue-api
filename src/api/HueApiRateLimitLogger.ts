import Bottleneck from 'bottleneck';

//TODO this is a different debug item otherwise we turn on the standar logging too
const DEBUG: boolean = /node-hue-rate-limits/.test(process.env['NODE_DEBUG'] || '');

export class HueApiRateLimitLogger {

  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  static install(name: string, bottleneck: Bottleneck) {
    if (HueApiRateLimitLogger.isDebug()) {
      const logger = new HueApiRateLimitLogger(name);

      bottleneck.on('error', (err) => {
        logger.log('error', err);
      });

      bottleneck.on('failed', (err) => {
        logger.log('failed', err);
      });

      bottleneck.on('received', (err) => {
        logger.log('received', err);
      });

      bottleneck.on('queued', (err) => {
        logger.log('queued', err);
      });

      bottleneck.on('executing', (err) => {
        logger.log('executing', err);
      });

      bottleneck.on('done', (err) => {
        logger.log('done', err);
      });
    }
  }

  static isDebug(): boolean {
    return DEBUG;
  }

  log(event: string, payload?: any) {
    if (HueApiRateLimitLogger.isDebug()) {
      let detail = `${event}`;

      if (payload) {
        detail += `\n${JSON.stringify(payload)}`;
      }

      console.log(`HueApiRateLimiter [${this.name}] :: ${detail}`);
    }
  }
}