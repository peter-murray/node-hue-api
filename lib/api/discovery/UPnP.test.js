'use strict';

const expect = require('chai').expect
  , UPnP = require('./UPnP')
;

describe('UPnP', function() {

  this.timeout(10000);

  it('should discover a bridge on the network', async () => {
    const upnp = new UPnP()
      , results = await upnp.search()
    ;

    expect(results).to.be.instanceOf(Array);
    expect(results[0]).to.have.property('id');
    expect(results[0]).to.have.property('internalipaddress');
  });
});