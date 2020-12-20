import * as bridgeValidator from './bridge-validation';
import { nupnp } from './nupnp';
import { SSDPSearch } from './UPnP';
import {
  BridgeConfigError, BridgeDiscoveryResponse, DiscoveryBridgeDefinition, DiscoveryBridgeDescription
} from './discoveryTypes';


export function upnpSearch(timeout?: number): Promise<DiscoveryBridgeDescription[]> {
  const upnp = new SSDPSearch();
  return upnp.search(timeout).then(loadDescriptions);
}

export function nupnpSearch(): Promise<BridgeDiscoveryResponse[]> {
  return nupnp().then(loadConfigurations);
}

export function description(ipAddress: string): Promise<DiscoveryBridgeDescription | undefined> {
  if (!ipAddress) {
    return Promise.resolve(undefined);
  }

  return loadDescriptions([{internalipaddress: ipAddress}])
    .then((results: DiscoveryBridgeDescription[]) => {
      return results[0];
    });
}

function loadDescriptions(results: DiscoveryBridgeDefinition[]): Promise<DiscoveryBridgeDescription[]> {
  const promises: Promise<DiscoveryBridgeDescription>[] = results.map(result => {
    return bridgeValidator.getBridgeDescription(result);
  });

  return Promise.all(promises);
}

function loadConfigurations(results: DiscoveryBridgeDefinition[]): Promise<BridgeDiscoveryResponse[]> {
  const promises: Promise<BridgeDiscoveryResponse>[] = results.map(result => {
    return bridgeValidator
      .getBridgeConfig(result)
      .then(config => {
        return {
          ipaddress: config.ipaddress,
          config: config
        }
      })
      .catch(err => {
        const error: BridgeConfigError = {
          error: {
            message: err.message as string,
            description: `Failed to connect and load configuration from the bridge at ip address ${result.internalipaddress}`,
            ipaddress: result.internalipaddress,
            id: result.id,
          }
        };

        return {
          ipaddress: result.internalipaddress,
          error: error
        };
      });
  });

  return Promise.all(promises);
}