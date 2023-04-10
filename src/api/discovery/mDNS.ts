import { DiscoveryBridgeDefinition } from './discoveryTypes.js';
import * as mDnsSd from 'node-dns-sd';

export class mDNSSearch {

  constructor() {
  }

  search(timeout?: number, returnOnFirstFound = false): Promise<DiscoveryBridgeDefinition[]> {
    return mDnsSd.default.discover({
      name: '_hue._tcp.local',
      wait: timeout ? timeout/1000 : 3,
      quick: returnOnFirstFound
    }).then((devices: any[] | undefined) => {
      let results: DiscoveryBridgeDefinition[] = [];

      if (devices && devices.length > 0) {
        devices.forEach((device: any) => {
          results.push({
            internalipaddress: device.address,
            id: device.fqdn
          });
        })
      }

      return results;
    })
  }
}