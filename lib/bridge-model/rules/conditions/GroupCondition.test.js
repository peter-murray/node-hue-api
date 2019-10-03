'use strict';

//TODO finish off tests

const expect = require('chai').expect
  , operators = require('./operators/index')
  , GroupCondition = require('./GroupCondition')
;

describe('GroupCondition', () => {


  // describe('creating invalid conditions', () => {
  //
  //   it('should create an empty condition', () => {
  //     const condition = new SensorCondition();
  //
  //     try {
  //       condition.getRuleCondition();
  //       expect.fail('should not get here');
  //     } catch (err) {
  //       expect(err.message).to.contain('Invalid Condition');
  //     }
  //   });
  //
  // });


  describe('creating valid conditions', () => {




    describe('attribute all_on', () => {

      it('should create condition for changed', () => {
        const condition = new GroupCondition(0).when().allOn().changed()
          , ruleCondition = condition.getRuleCondition()
        ;
        validateRuleCondition(ruleCondition, 0, 'all_on', operators.changed);
      });

      it('should create condition for equals', () => {
        const condition = new GroupCondition(1).when().allOn().equals(true)
          , ruleCondition = condition.getRuleCondition()
        ;
        validateRuleCondition(ruleCondition, 1, 'all_on', operators.equals, true);
      });

      it('should create condition for delayed change', () => {
        const condition = new GroupCondition(2).when().allOn().changedDelayed(false)
          , ruleCondition = condition.getRuleCondition()
        ;
        validateRuleCondition(ruleCondition, 2, 'all_on', operators.changedDelayed, false);
      });
    });

  });


  function validateRuleCondition(ruleCondition, groupId, attribute, operator, value) {
    expect(ruleCondition).to.exist;

    const payload = ruleCondition.payload;

    expect(payload).to.have.property('address').to.equal(`/groups/${groupId}/state/${attribute}`);
    expect(payload).to.have.property('operator').to.equal(operator.payload);

    if (value !== null && value !== undefined) {
      expect(payload).to.have.property('value').to.equal(`${value}`);
    } else {
      expect(payload).to.not.have.property('value');
    }
  }
});



