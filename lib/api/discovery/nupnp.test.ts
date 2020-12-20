import {expect} from 'chai'
import { nupnp } from './nupnp';

describe('N-UPnP', () => {

  it('should discover a bridge on the network', async () => {
    const results = await nupnp();

    expect(results).to.be.instanceOf(Array);
    expect(results[0]).to.have.property('id');
    expect(results[0]).to.have.property('internalipaddress');
  });
});