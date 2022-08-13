import { DiscoveryBridgeDefinition } from './discoveryTypes';

import * as bonjour from 'bonjour';
import { DiscoveryLogger } from './DiscoveryLogger';
import { Service } from 'bonjour';

export class mDNSSearch {

  private mdns: any;

  private browser: any;

  constructor() {
    this.mdns = bonjour.default({})
  }

  search(timeout?: number): Promise<DiscoveryBridgeDefinition[]> {
    const self = this;

    // Queue up a search for services immediately
    this.browser = this.mdns.find({
      type: 'hue',
      protocol: 'tcp',
    });
    DiscoveryLogger.install('mDNS', this.browser);

    return new Promise((resolve) => {
      this.browser.start();

      // Await our timeout before returning any results
      setTimeout(() => {
        const allServices = self.browser.services;

        let results: DiscoveryBridgeDefinition[] = [];
        if (allServices) {
          resolve(allServices.map((service: Service) => {
            if (service.addresses) {
              return {
                internalipaddress: service.addresses[0],
                id: service.fqdn,
              }
            }
          }))
        }

        self.browser.stop();
        resolve(results);
      }, timeout || 5000);
    });
  }

  finished() {
    if (this.mdns) {
      this.mdns.destroy();
    }
  }
}