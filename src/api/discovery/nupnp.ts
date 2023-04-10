import {request} from '../http/HttpClientFetch.js';
import { DiscoveryBridgeDefinition } from './discoveryTypes.js';
import { getDiscoveryMeetHueHttpsAgent } from './ca-chain.js';
import { ApiError } from '../../ApiError.js';

export function nupnp(): Promise<DiscoveryBridgeDefinition[]> {
  return request({
      url: 'https://discovery.meethue.com',
      json: true,
      httpsAgent: getDiscoveryMeetHueHttpsAgent(),
      method: 'GET',
    })
    .catch(err => {
      throw new ApiError(`Problems resolving hue bridges, ${err.message}`);
    })
    .then(response => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new ApiError(`Status code unexpected when using N-UPnP endpoint: ${response.status}`);
      }
    });
}