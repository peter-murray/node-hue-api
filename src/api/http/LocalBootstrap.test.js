'use strict';

const expect = require('chai').expect
  , testValues = require('../../../test/support/testValues')
;

const {LocalBootstrap} = require("./LocalBootstrap")
  , { HueApiRateLimits } = require('../HueApiRateLimits')
;

//TODO this is a non-portable test need to convert an ipv4 address to do this reliably

describe('LocalBootstrap', () => {

  it('should be able to connect over Ipv6 compact', async () => {
    return testConnect('::ffff:c0a8:a28');
  });

  it('should be able to connect over Ipv6 shortened', async () => {
    return testConnect('0:0:0:0:0:ffff:c0a8:0a28');
  });

  it('should be able to connect over Ipv6 expanded', async () => {
    return testConnect('0000:0000:0000:0000:0000:ffff:c0a8:0a28');
  });

  it('should be able to connect over Ipv6 compact in square brackets', async () => {
    return testConnect('[::ffff:c0a8:a28]');
  });

  async function testConnect(ipv6) {
    const localApi = new LocalBootstrap(ipv6, new HueApiRateLimits());

    return localApi.connect(testValues.username)
      .catch((err => {
        expect.fail(`Problem connecting to IPv6 address '${ipv6}'; ${err.message}`);
      }));
  }
});