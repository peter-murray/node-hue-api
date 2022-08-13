import EventEmitter from 'events';

const DEBUG: boolean = /node-hue-discovery/.test(process.env['NODE_DEBUG'] || '');

export class DiscoveryLogger {

  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  static install(name: string, browser: EventEmitter) {
    if (DiscoveryLogger.isDebug()) {
      const logger = new DiscoveryLogger(name);
      logger.log(`Installing discovery logger`);

      browser.on('up', (val: any) => {
        logger.log(`**up: ${JSON.stringify(val)}`);
      });

      browser.on('down', (val: any) => {
        logger.log(`**down: ${JSON.stringify(val)}`);
      });

      browser.on('error', (val: any) => {
        logger.log(`**error: ${JSON.stringify(val)}`);
      });
    }
  }

  static isDebug(): boolean {
    return DEBUG;
  }

  log(event: string, payload?: any) {
    if (DiscoveryLogger.isDebug()) {
      let detail = `${event}`;

      if (payload) {
        detail += `\n${JSON.stringify(payload)}`;
      }

      console.log(`DiscoveryLogger [${this.name}] :: ${detail}`);
    }
  }
}