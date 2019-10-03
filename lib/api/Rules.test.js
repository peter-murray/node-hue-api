'use strict';

const expect = require('chai').expect
  , HueApi = require('../v3').api
  , discovery = require('../v3').discovery

  , CLIPOpenCloseSensor = require('../v3').sensors.clip.OpenClose

  , Rule = require('../bridge-model/rules/Rule')
  , LightState = require('../v3').lightStates.LightState
  , conditionOperators = require('../v3').rules.conditions.operators

  , rules = require('../v3').rules
  , testValues = require('../../test/support/testValues.js')
;

describe('Hue API #rules', () => {

  let hue
    , testOpenCloseSensor
  ;

  before(async () => {
    return discovery.nupnpSearch()
      .then(searchResults => {

        return HueApi.create(searchResults[0].ipaddress, testValues.username)
          .then(api => {
            hue = api;
          })
          .then(() => {
            const sensor = new CLIPOpenCloseSensor({
              name: 'Test Open/Close Sensor',
              modelid: 'software',
              swversion: '1.0',
              uniqueid: '00:00:00:01',
              manufacturername: 'software',
              config: {
                url: 'http://developers.meethue.com'
              }
            });
            return hue.sensors.createSensor(sensor);
          })
          .then(result => {
            return hue.sensors.get(result.id);
          })
          .then(sensor => {
            testOpenCloseSensor = sensor;
          });
      });
  });

  after(async () => {
    if (hue && testOpenCloseSensor) {
      try {
        await hue.sensors.deleteSensor(testOpenCloseSensor.id);
      } catch (err) {
        console.log(`Failed to remove CLIP Sensor, ${testOpenCloseSensor.toString()}, error: ${err}`);
      }
    }
  });


  describe('#getAll()', () => {

    it('should find some', async () => {
      const results = await hue.rules.getAll();

      expect(results).to.be.instanceOf(Array);
      expect(results).to.have.length.greaterThan(0);

      // console.log(JSON.stringify(results, null, 2));

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
          console.error(`Failed to delete rule: ${ruleId}`);
        }
      }
    });

    it('should create a new rule', async () => {
      const rule = new Rule();
      rule.name = 'Simple Test Rule';
      rule.recycle = true;

      rule.addCondition(rules.conditions.sensor(testOpenCloseSensor).when('open').changed());
      rule.addAction(new rules.actions.light(testValues.hueLightId).withState(new LightState().on()));

      const result = await hue.rules.createRule(rule);
      expect(result).to.have.property('id');
      ruleId = result.id;
    });
  });


  describe('#deleteRule()', () => {

    let ruleId = null;

    beforeEach(async () => {
      const rule = new Rule();
      rule.name = 'Test Rule to be deleted';
      rule.recycle = true;
      rule.addCondition(rules.conditions.sensor(testOpenCloseSensor).when('open').equals(true));
      rule.addAction(new rules.actions.light(testValues.hueLightId).withState(new LightState().on()));

      const result = await hue.rules.createRule(rule);
      ruleId = result.id;
    });

    afterEach(async () => {
      if (ruleId) {
        const existing = await hue.rules.get(ruleId);
        if (existing) {
          try {
            await hue.rules.deleteRule(ruleId);
          } catch (err) {
            console.error(`Failed to delete rule: ${ruleId}`);
          }
        }
      }
    });


    it('should delete a rule', async () => {
      const result = await hue.rules.deleteRule(ruleId);
      expect(result).to.have.be.true;
      ruleId = null;
    });
  });


  // describe('#getOrphanedRules()', () => {
  //
  //   it('should get orphaned rules', async () => {
  //     const results = await hue.rules.getOrphanedRules();
  //     expect(results).to.be.instanceOf(Array);
  //     // console.log(JSON.stringify(results, null, 2));
  //   });
  // });
  //
  //
  // describe('#getDisabledRules()', () => {
  //
  //   it('should get disabled rules', async () => {
  //     const results = await hue.rules.getDisabledRules();
  //     expect(results).to.be.instanceOf(Array);
  //     // console.log(JSON.stringify(results, null, 2));
  //   });
  // });


  describe('#updateRule()', () => {

    let ruleId
      , rule
    ;

    beforeEach(async () => {
      const newRule = new Rule();
      newRule.name = 'Test Rule to be deleted';
      newRule.recycle = true;
      newRule.addCondition(rules.conditions.sensor(testOpenCloseSensor).when('open').equals(true));
      newRule.addAction(new rules.actions.light(testValues.hueLightId).withState(new LightState().on()));

      const result = await hue.rules.createRule(newRule);
      ruleId = result.id;

      rule = await hue.rules.get(ruleId);
    });

    afterEach(async () => {
      if (ruleId) {
        const existing = await hue.rules.get(ruleId);

        if (existing) {
          try {
            await hue.rules.deleteRule(ruleId);
          } catch (err) {
            console.error(`Failed to delete rule: ${ruleId}`);
          }
        }
      }
    });


    it('should update the name', async () => {
      rule.name = `Updated - ${Date.now()}`;

      const result = await hue.rules.updateRule(rule);
      expect(result).to.have.property('name').to.be.true;
      expect(result).to.have.property('actions').to.be.true;
      expect(result).to.have.property('conditions').to.be.true;
    });


    it('should update conditions', async () => {
      rule.resetConditions();
      rule.addCondition(rules.conditions.sensor(testOpenCloseSensor).when('open').equals(false));

      const result = await hue.rules.updateRule(rule);
      expect(result).to.have.property('name').to.be.true;
      expect(result).to.have.property('actions').to.be.true;
      expect(result).to.have.property('conditions').to.be.true;

      const updatedRule = await hue.rules.get(ruleId);
      expect(updatedRule.conditions).to.have.length(1);

      const condition = updatedRule.conditions[0];
      expect(condition).to.have.property('operator').to.equal(conditionOperators.equals);
      expect(condition).to.have.property('value').to.equal('false');
    });


    it('should add an action', async () => {
      rule.resetActions();
      rule.addAction(rules.actions.light(0).withState(new LightState().on(false)));

      const result = await hue.rules.updateRule(rule);
      expect(result).to.have.property('name').to.be.true;
      expect(result).to.have.property('actions').to.be.true;
      expect(result).to.have.property('conditions').to.be.true;

      const updatedRule = await hue.rules.get(ruleId);
      expect(updatedRule.actions).to.have.length(1);

      const action = updatedRule.actions[0];
      expect(action).to.have.property('address').to.equal('/lights/0/state');
      expect(action).to.have.property('method').to.equal('PUT');
      expect(action).to.have.property('body').to.deep.equals({on: false});
    });


    it('should produce error if no conditions set', async () => {
      try {
        rule.resetConditions();
        hue.rules.updateRule(rule);
        expect.fail('Should have produced an error');
      } catch (err) {
        expect(err).to.have.property('message').to.contain('at least one condition');
      }
    });

    it('should produce error if no actions set', async () => {
      try {
        rule.resetActions();
        hue.rules.updateRule(rule);
        expect.fail('Should have produced an error');
      } catch (err) {
        expect(err).to.have.property('message').to.contain('at least one action');
      }
    });
  });
});