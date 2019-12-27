'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , model = require('../v3').model
  , LightState = model.lightStates.LightState
  , GroupState = model.lightStates.GroupLightState
  , conditionOperators = model.ruleConditionOperators
  , testValues = require('../../test/support/testValues.js')
;

describe('Hue API #rules', () => {

  let hue
    , testSensor
    , targetLight
    , targetGroup
  ;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        const localApi = v3Api.createLocal(searchResults[0].ipaddress);
        return localApi.connect(testValues.username)
          .then(api => {
            hue = api;
          })
          .then(() => {
            const sensor = model.createCLIPOpenCloseSensor();
            sensor.name = 'Test Open/Close Sensor';
            sensor.modelid = 'software';
            sensor.swversion = '1.0';
            sensor.uniqueid = '00:00:00:01';
            sensor.manufacturername = 'software';
            sensor.config = {
              url: 'http://developers.meethue.com'
            };
            return hue.sensors.createSensor(sensor);
          })
          .then(sensor => {
            testSensor = sensor;

            return Promise.all([
              hue.lights.getAll(),
              hue.groups.getAll()
            ]);
          })
          .then(results => {
            targetLight = results[0][1];
            targetGroup = results[1][1];
          });
      });
  });


  after(async () => {
    if (hue && testSensor) {
      try {
        await hue.sensors.deleteSensor(testSensor.id);
      } catch (err) {
        console.error(`Failed to remove CLIP Sensor, ${testSensor.toString()}, error: ${err}`);
      }
    }
  });


  describe('#getAll()', () => {

    it('should find some', async () => {
      const results = await hue.rules.getAll();

      expect(results).to.be.instanceOf(Array);
      expect(results).to.have.length.greaterThan(0);

      const rule = results[0];

      expect(model.isRuleInstance(rule)).to.be.true;
      expect(rule).to.have.property('name');
      expect(rule).to.have.property('owner');

      //TODO more fields
    });
  });


  describe('#getRule()', () => {

    describe('using id value', () => {

      it('should get an existing rule', async () => {
        const allRules = await hue.rules.getAll()
          , target = allRules[0]
        ;

        const rule = await hue.rules.getRule(target.id);

        expect(rule).to.have.property('id').to.equal(target.id);
      });
    });


    describe('using Rule object', () => {

      it('should get an existing rule', async () => {
        const allRules = await hue.rules.getAll()
          , target = allRules[1]
        ;

        const rule = await hue.rules.getRule(target);
        expect(rule).to.have.property('id').to.equal(target.id);
      });
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
      const rule = model.createRule();
      rule.name = 'Simple Test Rule';
      rule.recycle = true;

      rule.addCondition(model.ruleConditions.sensor(testSensor).when('open').changed());
      rule.addAction(model.actions.light(targetLight).withState(new LightState().on()));

      const result = await hue.rules.createRule(rule);
      expect(result).to.have.property('id');
      ruleId = result.id;
    });
  });


  describe('#deleteRule()', () => {

    let rule = null;

    beforeEach(async () => {
      const newRule = model.createRule();
      newRule.name = 'Test Rule to be deleted';
      newRule.recycle = true;
      newRule.addCondition(model.ruleConditions.sensor(testSensor).when('open').equals(true));
      newRule.addAction(model.actions.light(targetLight).withState(new LightState().on()));

      rule = await hue.rules.createRule(newRule);
    });

    afterEach(async () => {
      if (rule) {
        let existing = null;

        try {
          existing = await hue.rules.getRule(rule);
        } catch (err) {
          // Not found is fine
          expect(err.getHueErrorType()).to.equal(3);
        }

        if (existing) {
          try {
            await hue.rules.deleteRule(rule);
          } catch (err) {
            console.error(`Failed to delete rule: ${rule.id}`);
          }
        }
      }
    });


    it('should delete a rule using id', async () => {
      const result = await hue.rules.deleteRule(rule.id);
      expect(result).to.have.be.true;
    });

    it('should delete a rule using Rule object', async () => {
      const result = await hue.rules.deleteRule(rule);
      expect(result).to.have.be.true;
    });

    it('should error if a rule is not found', async () => {
      const allRules = await hue.rules.getAll();
      const invalidRuleId = getNextRuleId(allRules);

      try {
        await hue.rules.deleteRule(invalidRuleId);
        expect.fail('should not get here')
      } catch (err) {
        expect(err.getHueErrorType()).to.equal(3);
        expect(err.message).to.contain('not available');
      }
    })
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

    let rule;

    beforeEach(async () => {
      const newRule = model.createRule();
      newRule.name = 'Test Rule to be deleted';
      newRule.recycle = true;
      newRule.addCondition(model.ruleConditions.sensor(testSensor).when('open').equals(true));
      newRule.addAction(model.actions.light(targetLight).withState(new LightState().on()));

      rule = await hue.rules.createRule(newRule);
    });

    afterEach(async () => {
      if (rule) {
        const existing = await hue.rules.getRule(rule);

        if (existing) {
          try {
            await hue.rules.deleteRule(rule);
          } catch (err) {
            console.error(`Failed to delete rule: ${rule.id}`);
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
      rule.addCondition(model.ruleConditions.sensor(testSensor).when('open').equals(false));

      const result = await hue.rules.updateRule(rule);
      expect(result).to.have.property('name').to.be.true;
      expect(result).to.have.property('actions').to.be.true;
      expect(result).to.have.property('conditions').to.be.true;

      const updatedRule = await hue.rules.getRule(rule);
      expect(updatedRule.conditions).to.have.length(1);

      const condition = updatedRule.conditions[0];
      expect(condition).to.have.property('operator').to.equal(conditionOperators.equals);
      expect(condition).to.have.property('value').to.equal('false');
    });


    describe('adding actions', () => {

      it('should add a LightStateAction', async () => {
        rule.resetActions();
        rule.addAction(model.actions.light(targetLight).withState(new LightState().on(false)));

        const result = await hue.rules.updateRule(rule);
        expect(result).to.have.property('name').to.be.true;
        expect(result).to.have.property('actions').to.be.true;
        expect(result).to.have.property('conditions').to.be.true;

        const updatedRule = await hue.rules.getRule(rule);
        expect(updatedRule.actions).to.have.length(1);

        const action = updatedRule.actions[0];
        expect(action).to.have.property('address').to.equal(`/lights/${targetLight.id}/state`);
        expect(action).to.have.property('method').to.equal('PUT');
        expect(action).to.have.property('body').to.deep.equals({on: false});
      });

      it('should add a GroupStateAction', async () => {
        rule.resetActions();
        rule.addAction(model.actions.group(targetGroup).withState(new GroupState().on(false)));

        const result = await hue.rules.updateRule(rule);
        expect(result).to.have.property('name').to.be.true;
        expect(result).to.have.property('actions').to.be.true;
        expect(result).to.have.property('conditions').to.be.true;

        const updatedRule = await hue.rules.getRule(rule);
        expect(updatedRule.actions).to.have.length(1);

        const action = updatedRule.actions[0];
        expect(action).to.have.property('address').to.equal(`/groups/${targetGroup.id}/action`);
        expect(action).to.have.property('method').to.equal('PUT');
        expect(action).to.have.property('body').to.deep.equals({on: false});
      });

      //TODO expand to cover all other actions
    });


    it('should produce error if no conditions set', async () => {
      try {
        rule.resetConditions();
        await hue.rules.updateRule(rule);
        expect.fail('Should have produced an error');
      } catch (err) {
        expect(err).to.have.property('message').to.contain('at least one condition');
      }
    });

    it('should produce error if no actions set', async () => {
      try {
        rule.resetActions();
        await hue.rules.updateRule(rule);
        expect.fail('Should have produced an error');
      } catch (err) {
        expect(err).to.have.property('message').to.contain('at least one action');
      }
    });
  });
});


function getNextRuleId(allRules) {
  const ids = allRules.map(rule => rule.id);

  let id = 1
    , nextId = null
  ;
  while (!nextId) {
    id++;

    if (ids.indexOf(`${id}`) === -1) {
      nextId = id;
    }
  }

  return nextId;
}