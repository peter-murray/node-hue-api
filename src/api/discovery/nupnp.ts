import {request} from '../http/HttpClientFetch';
import { DiscoveryBridgeDefinition } from './discoveryTypes';
import { getDiscoveryMeetHueHttpsAgent } from './ca-chain';
import { ApiError } from '../../ApiError';

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
};