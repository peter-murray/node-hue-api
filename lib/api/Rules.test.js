'use strict';

const expect = require('chai').expect
  , HueApi = require('../v3').api
  , discovery = require('../v3').discovery
  , Rule = require('../bridge-model/rules/Rule')
  , testValues = require('../../test/support/testValues.js')
  , ApiError = require('../ApiError')
;

describe('Hue API #rules', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        return HueApi.create(searchResults[0].ipaddress, testValues.username)
          .then(api => {
            hue = api;
          });
      });
  });


  describe('#getAll()', () => {

    it('should find some', async () => {
      const results = await hue.rules.getAll();

      expect(results).to.be.instanceOf(Array);
      expect(results).to.have.length.greaterThan(0);

      console.log(JSON.stringify(results, null, 2));

      expect(results[0]).to.be.instanceOf(Rule);
      expect(results[0]).to.have.property('name');
      expect(results[0]).to.have.property('owner');

      //TODO more fields
    });
  });


  describe('#get()', () => {

    it('should get an existing rule', async () => {
      const all = await hue.rules.getAll()
        , target = all[0]
      ;

      const rule = await hue.rules.get(target.id);

      expect(rule).to.have.property('id').to.equal(target.id);
      //TODO more values need to be checked
    });
  });


  describe('#createRule()', () => {

    let ruleId = null;

    afterEach(async () => {
      if (ruleId) {
        try {
          await hue.rules.deleteRule(ruleId);
        } catch (err) {
          console.error(`Failed to delete rule: ${reulId}`);
        }
      }
    });

    it('should create a new rule', async () => {
      const rule = new Rule();

      const result = await hue.rules.createRule(rule);
      console.log(JSON.stringify(result, null, 2));
    });
  });

});