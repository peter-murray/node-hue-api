import { expect } from 'chai';
import { SSDPSearch } from './UPnP';

describe('UPnP', function () {

  this.timeout(10000);

  it('should discover a bridge on the network', async () => {
    const upnp = new SSDPSearch()
      , results = await upnp.search(8000)
    ;

    expect(results).to.be.instanceOf(Array);
    expect(results).to.have.length.greaterThan(0);
    expect(results[0]).to.have.property('id');
    expect(results[0]).to.have.property('internalipaddress');
  });
});