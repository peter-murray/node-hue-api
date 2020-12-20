'use strict';
import {expect} from 'chai';

import testValues = require('../../test/support/testValues.js');
import { discovery } from '../index';
import { v3 } from '../v3';

describe('Hue API #capabilities', () => {

  let hue;

  before(async () => {
    const searchResults = await discovery.nupnpSearch();
    expect(searchResults).to.have.length.at.least(1);

    expect(searchResults[0]).to.have.property('config');
    const localApi = v3.api.createLocal(searchResults[0].ipaddress);
    hue = await localApi.connect(testValues.username);
  });

  describe('#getAll()', () => {

    it('should get all capabilities', async () => {
      const capabilities = await hue.capabilities.getAll();

      expect(capabilities).to.have.property('lights');
      expect(capabilities).to.have.property('sensors');
      expect(capabilities).to.have.property('groups');
      expect(capabilities).to.have.property('scenes');
      expect(capabilities).to.have.property('schedules');
      expect(capabilities).to.have.property('rules');
      expect(capabilities).to.have.property('resourcelinks');
      expect(capabilities).to.have.property('streaming');

      expect(capabilities.timezones).to.be.instanceOf(Array);
    });
  });
});