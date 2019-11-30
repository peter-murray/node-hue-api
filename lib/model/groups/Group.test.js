'use strict';

const expect = require('chai').expect
  , model = require('../index')
;


describe('Bridge Model - Group', () => {

  describe('#createFromJson()', () => {

    describe('LightGroup', () => {

      const LIGHTGROUP_PAYLOAD = {
        "id": 1,
        "name": "VRC 1",
        "lights": [
          2,
          3,
          4,
          5,
          6,
          7,
          8
        ],
        "sensors": [],
        "type": "LightGroup",
        "state": {
          "all_on": false,
          "any_on": true
        },
        "recycle": false,
        "action": {
          "on": false,
          "bri": 61,
          "hue": 14988,
          "sat": 141,
          "effect": "none",
          "xy": [
            0.4575,
            0.4101
          ],
          "ct": 366,
          "alert": "select",
          "colormode": "ct"
        },
        "node_hue_api": {
          "type": "group",
          "version": 1
        }
      };

      it('should process valid payload', () => {
        const payload = LIGHTGROUP_PAYLOAD
          , group = model.createFromJson(payload)
        ;

        expect(model.isGroupInstance(group)).to.be.true;

        expect(group).to.have.property('id').to.equal(payload.id);
        expect(group).to.have.property('name').to.equal(payload.name);
        expect(group).to.have.property('lights').to.have.members(payload.lights.map(id => Number(id)));
        expect(group).to.have.property('sensors').to.be.empty;
        expect(group).to.have.property('type').to.equal(payload.type);
        expect(group).to.have.property('recycle').to.equal(payload.recycle);
        expect(group).to.have.property('action').to.deep.equal(payload.action);
      });
    });

    describe('Zone', () => {

      const ZONE_PAYLOAD = {
        "id": 1,
        "name": "Testing Zone Creation",
        "lights": [2, 3, 4],
        "sensors": [],
        "type": "Zone",
        "state": {"all_on": false, "any_on": true},
        "recycle": false,
        "class": "Other",
        "action": {
          "on": false,
          "bri": 254,
          "hue": 0,
          "sat": 0,
          "effect": "none",
          "xy": [0.3804, 0.3768],
          "ct": 366,
          "alert": "select",
          "colormode": "ct"
        },
        "node_hue_api": {"type": "group", "version": 1}
      }

      it('should process valid payload', () => {
        const payload = ZONE_PAYLOAD
          , group = model.createFromJson(payload)
        ;

        expect(model.isGroupInstance(group)).to.be.true;

        expect(group).to.have.property('id').to.equal(payload.id);
        expect(group).to.have.property('name').to.equal(payload.name);
        expect(group).to.have.property('lights').to.have.members(payload.lights.map(id => Number(id)));
        expect(group).to.have.property('sensors').to.be.empty;
        expect(group).to.have.property('type').to.equal(payload.type);
        expect(group).to.have.property('recycle').to.equal(payload.recycle);
        expect(group).to.have.property('class').to.equal(payload.class);
        expect(group).to.have.property('action').to.deep.equal(payload.action);
      })
    });

    //TODO
  });


  describe('#createFromBridge()', () => {

    describe('LightGroup', () => {

      const LIGHTGROUP_PAYLOAD = {
        "name": "VRC 1",
        "lights": [
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8"
        ],
        "sensors": [],
        "type": "LightGroup",
        "state": {
          "all_on": false,
          "any_on": true
        },
        "recycle": false,
        "action": {
          "on": false,
          "bri": 61,
          "hue": 14988,
          "sat": 141,
          "effect": "none",
          "xy": [
            0.4575,
            0.4101
          ],
          "ct": 366,
          "alert": "select",
          "colormode": "ct"
        }
      };

      it('should process valid payload', () => {
        const id = 1
          , payload = LIGHTGROUP_PAYLOAD
          , group = model.createFromBridge('group', id, payload)
        ;

        expect(model.isGroupInstance(group)).to.be.true;

        expect(group).to.have.property('id').to.equal(id);
        expect(group).to.have.property('name').to.equal(payload.name);
        expect(group).to.have.property('lights').to.have.members(payload.lights.map(id => Number(id)));
        expect(group).to.have.property('sensors').to.be.empty;
        expect(group).to.have.property('type').to.equal(payload.type);
        expect(group).to.have.property('recycle').to.equal(payload.recycle);
        expect(group).to.have.property('action').to.deep.equal(payload.action);
        //TODO state, all_on and any_on
      });
    });


    describe('Zone', () => {

      const ZONE_PAYLOAD = {
        "name": "Testing Zone Creation",
        "lights": [
          "2",
          "3",
          "4"
        ],
        "sensors": [],
        "type": "Zone",
        "state": {
          "all_on": false,
          "any_on": true
        },
        "recycle": false,
        "class": "Other",
        "action": {
          "on": false,
          "bri": 254,
          "hue": 0,
          "sat": 0,
          "effect": "none",
          "xy": [
            0.3804,
            0.3768
          ],
          "ct": 366,
          "alert": "select",
          "colormode": "ct"
        }
      };


      it('should process valid payload', () => {
        const id = 1
          , payload = ZONE_PAYLOAD
          , group = model.createFromBridge('group', id, payload)
        ;

        expect(model.isGroupInstance(group)).to.be.true;
        expect(group).to.have.property('id').to.equal(id);
        expect(group).to.have.property('name').to.equal(payload.name);
        expect(group).to.have.property('lights').to.have.members(payload.lights.map(id => Number(id)));
        expect(group).to.have.property('sensors').to.be.empty;
        expect(group).to.have.property('type').to.equal(payload.type);
        expect(group).to.have.property('recycle').to.equal(payload.recycle);
        expect(group).to.have.property('class').to.equal(payload.class);
        expect(group).to.have.property('action').to.deep.equal(payload.action);
      });
    });


    describe('Room', () => {

      const ROOM_PAYLAOD = {
        "name": "Bedroom Lamps",
        "lights": [
          "7",
          "8"
        ],
        "sensors": [],
        "type": "Room",
        "state": {
          "all_on": false,
          "any_on": false
        },
        "recycle": false,
        "class": "Other",
        "action": {
          "on": false,
          "bri": 61,
          "hue": 14988,
          "sat": 141,
          "effect": "none",
          "xy": [
            0.4575,
            0.4101
          ],
          "ct": 366,
          "alert": "select",
          "colormode": "ct"
        }
      }
    });


    describe('Entertainment', () => {

      const ENTERTAINMENT_PAYLOAD = {
        "name": "Lounge Entertainment",
        "lights": [
          "18",
          "37",
          "38",
          "17"
        ],
        "sensors": [],
        "type": "Entertainment",
        "state": {
          "all_on": true,
          "any_on": true
        },
        "recycle": false,
        "class": "TV",
        "stream": {
          "proxymode": "manual",
          "proxynode": "/lights/22",
          "active": false,
          "owner": null
        },
        "locations": {
          "17": [
            -0.65,
            -0.84,
            0
          ],
          "18": [
            0.69,
            -0.85,
            0
          ],
          "37": [
            -0.51,
            0.85,
            0
          ],
          "38": [
            0.44,
            0.84,
            0
          ]
        },
        "action": {
          "on": true,
          "bri": 102,
          "hue": 2595,
          "sat": 127,
          "effect": "none",
          "xy": [
            0.5095,
            0.3624
          ],
          "ct": 459,
          "alert": "select",
          "colormode": "hs"
        }
      };

      it('should process valid payload', () => {
        const id = 1
          , payload = ENTERTAINMENT_PAYLOAD
          , group = model.createFromBridge('group', id, payload)
        ;

        expect(model.isGroupInstance(group)).to.be.true;
        expect(group).to.have.property('id').to.equal(id);
        expect(group).to.have.property('name').to.equal(payload.name);
        expect(group).to.have.property('lights').to.have.members(payload.lights.map(id => Number(id)));
        expect(group).to.have.property('sensors').to.be.empty;
        expect(group).to.have.property('type').to.equal(payload.type);
        expect(group).to.have.property('recycle').to.equal(payload.recycle);
        expect(group).to.have.property('class').to.equal(payload.class);
        expect(group).to.have.property('stream').to.deep.equal(payload.class);
        expect(group).to.have.property('locations').to.deep.equal(payload.locations);
        expect(group).to.have.property('action').to.deep.equal(payload.action);
        console.log(JSON.stringify(group));
      });
    });
  });
});