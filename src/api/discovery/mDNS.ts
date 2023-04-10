import { DiscoveryBridgeDefinition } from './discoveryTypes';
const mDnsSd = require('node-dns-sd');

export class mDNSSearch {

  constructor() {
  }

  search(timeout?: number, returnOnFirstFound = false): Promise<DiscoveryBridgeDefinition[]> {
    return mDnsSd.discover({
      name: '_hue._tcp.local',
      wait: timeout ? timeout/1000 : 3,
      quick: returnOnFirstFound
    }).then((devices: any) => {
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