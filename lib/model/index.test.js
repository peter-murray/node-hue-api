'use strict';

const expect = require('chai').expect
  , model = require('./index')
;


describe('Bridge Model', () => {

  describe('#createFromJson()', () => {

    describe('Light', () => {

      const VALID_LIGHT_PAYLOAD = {
        'id': 1,
        'state': {
          'on': true,
          'bri': 1,
          'hue': 16312,
          'sat': 64,
          'effect': 'none',
          'xy': [
            0.4523,
            0.4228
          ],
          'alert': 'select',
          'colormode': 'xy',
          'mode': 'homeautomation',
          'reachable': true
        },
        'swupdate': {
          'state': 'notupdatable',
          'lastinstall': null
        },
        'type': 'Color light',
        'name': 'Lounge Living Color',
        'modelid': 'LLC001',
        'manufacturername': 'Philips',
        'productname': 'LivingColors',
        'capabilities': {
          'certified': true,
          'control': {
            'colorgamuttype': 'A',
            'colorgamut': [
              [
                0.704,
                0.296
              ],
              [
                0.2151,
                0.7106
              ],
              [
                0.138,
                0.08
              ]
            ]
          },
          'streaming': {
            'renderer': false,
            'proxy': false
          }
        },
        'config': {
          'archetype': 'floorshade',
          'function': 'decorative',
          'direction': 'omnidirectional'
        },
        'uniqueid': '00:aa:11:01:00:09:d0:b1-0b',
        'swversion': '2.0.0.5206',
        'node_hue_api': {
          'type': 'light',
          'version': 1
        }
      };

      it('should create model object from valid payload', () => {
        const light = model.createFromJson(VALID_LIGHT_PAYLOAD);

        expect(light).to.have.property('id').to.equal(VALID_LIGHT_PAYLOAD.id);
        expect(light).to.have.property('name').to.equal(VALID_LIGHT_PAYLOAD.name);
        expect(light).to.have.property('type').to.equal(VALID_LIGHT_PAYLOAD.type);
        expect(light).to.have.property('modelid').to.equal(VALID_LIGHT_PAYLOAD.modelid);
        expect(light).to.have.property('manufacturername').to.equal(VALID_LIGHT_PAYLOAD.manufacturername);
        expect(light).to.have.property('productname').to.equal(VALID_LIGHT_PAYLOAD.productname);
        expect(light).to.have.property('capabilities').to.deep.equal(VALID_LIGHT_PAYLOAD.capabilities);
        expect(light).to.have.property('uniqueid').to.equal(VALID_LIGHT_PAYLOAD.uniqueid);
        expect(light).to.have.property('swversion').to.equal(VALID_LIGHT_PAYLOAD.swversion);
      });
    });
  });


  describe('#createFromBridge()', () => {


    describe('Light', () => {

      const VALID_LIGHT_PAYLOAD = {
        'state': {
          'on': true,
          'bri': 1,
          'hue': 16312,
          'sat': 64,
          'effect': 'none',
          'xy': [
            0.4523,
            0.4228
          ],
          'alert': 'select',
          'colormode': 'xy',
          'mode': 'homeautomation',
          'reachable': true
        },
        'swupdate': {
          'state': 'notupdatable',
          'lastinstall': null
        },
        'type': 'Color light',
        'name': 'Lounge Living Color',
        'modelid': 'LLC001',
        'manufacturername': 'Philips',
        'productname': 'LivingColors',
        'capabilities': {
          'certified': true,
          'control': {
            'colorgamuttype': 'A',
            'colorgamut': [
              [
                0.704,
                0.296
              ],
              [
                0.2151,
                0.7106
              ],
              [
                0.138,
                0.08
              ]
            ]
          },
          'streaming': {
            'renderer': false,
            'proxy': false
          }
        },
        'config': {
          'archetype': 'floorshade',
          'function': 'decorative',
          'direction': 'omnidirectional'
        },
        'uniqueid': '00:aa:11:01:00:09:d0:b1-0b',
        'swversion': '2.0.0.5206'
      };

      it('should create a light from a valid payload', () => {
        const id = 1
          , light = model.createFromBridge('light', id, VALID_LIGHT_PAYLOAD);

        expect(light).to.have.property('id').to.equal(1);
        expect(light).to.have.property('name').to.equal(VALID_LIGHT_PAYLOAD.name);
        expect(light).to.have.property('type').to.equal(VALID_LIGHT_PAYLOAD.type);
        expect(light).to.have.property('modelid').to.equal(VALID_LIGHT_PAYLOAD.modelid);
        expect(light).to.have.property('manufacturername').to.equal(VALID_LIGHT_PAYLOAD.manufacturername);
        expect(light).to.have.property('productname').to.equal(VALID_LIGHT_PAYLOAD.productname);
        expect(light).to.have.property('capabilities').to.deep.equal(VALID_LIGHT_PAYLOAD.capabilities);
        expect(light).to.have.property('uniqueid').to.equal(VALID_LIGHT_PAYLOAD.uniqueid);
        expect(light).to.have.property('swversion').to.equal(VALID_LIGHT_PAYLOAD.swversion);
      });
    });


    describe('Group', () => {

      const VALID_LIGHT_GROUP_PAYLOAD = {
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
        }
        , VALID_ZONE_GROUP_PAYLOAD = {
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
        }
        , VALID_ROOM_GROUP_PAYLOAD = {
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
        , VALID_ENTERTAINMENT_PAYLOAD = {
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
        }
      ;

      it('should create a group from a valid payload', () => {

      });

    })
  });
});