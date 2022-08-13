import {expect} from 'chai'
import * as discovery from './index';
import { BridgeConfigData } from './discoveryTypes';

describe('discovery', () => {

  describe('#nupnpSearch()', function () {

    this.timeout(10000);

    it('should discover a bridge', async () => {
      const results = await discovery.nupnpSearch();

      expect(results).to.be.instanceOf(Array);

      expect(results[0]).to.have.property('ipaddress');

      expect(results[0]).to.have.property('config');
      const config = results[0].config;
      expect(config).to.have.property('name');
      expect(config).to.have.property('modelid');
      expect(config).to.have.property('swversion');
    });
  });

  describe('#mdnsSearch()', function () {

    this.timeout(10000);

    it('should discover a bridge', async () => {
      const results = await discovery.mdnsSearch();

      expect(results).to.be.instanceOf(Array);
      expect(results).to.have.length.greaterThan(0);

      expect(results[0]).to.have.property('name');
      expect(results[0]).to.have.property('ipaddress');

      expect(results[0]).to.have.property('model');
      expect(results[0].model).to.have.property('name');
      expect(results[0].model).to.have.property('number');
      expect(results[0].model).to.have.property('serial');
    });
  });

  describe('#description()', function ()  {

    this.timeout(10000);

    let hostAddress: string;

    before(async() => {
      const results = await discovery.nupnpSearch();

      expect(results).to.have.length.greaterThan(0);

      if (results[0] as BridgeConfigData) {
        //TODO sort this out
        // @ts-ignore
        hostAddress = results[0].ipaddress;
      }
    });

    it('should discover a bridge', async () => {
      const result = await discovery.description(hostAddress);

      expect(result).to.have.property('name');
      expect(result).to.have.property('ipaddress');

      expect(result).to.have.property('model');
      // @ts-ignore
      expect(result.model).to.have.property('name');
      // @ts-ignore
      expect(result.model).to.have.property('number');
      // @ts-ignore
      expect(result.model).to.have.property('serial');
    });
  });
});