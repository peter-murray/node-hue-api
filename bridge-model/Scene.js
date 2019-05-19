'use strict';

const ApiError = require('../api/ApiError')
  , BridgeObject = require('./BridgeObject')
  , utils = require('../hue-api/utils')
;

module.exports = class Scene extends BridgeObject {

  constructor(data, id) {
    super(data, id);

    if (!data || !data.recycle) {
      this.recycle = false;
    }
  }

  get group() {
    return this.getRawDataValue('group');
  }

  set group(id) {
    this.type = 'GroupScene';
    this._updateRawDataValue('group', id);
    return this;
  }

  get lights() {
    return this.getRawDataValue('lights');
  }

  set lights(lightIds) {
    this.type = 'LightScene';

    const value = utils.createStringValueArray(lightIds);
    this._updateRawDataValue('lights', value);

    return this;
  }

  get lightstates() {
    return this.getRawDataValue('lightstates');
  }

  set lightstates(value) {
    //TODO needs to be an {id: {}, id: {}} type object
    this._updateRawDataValue('type', null);
    this._updateRawDataValue('lightstates', value);
    return this;
  }

  get type() {
    return this.getRawDataValue('type');
  }

  set type(value) {
    if (['LightScene', 'GroupScene'].indexOf(value) === -1) {
      throw new ApiError(`Invalid type for scene, '${value}'`)
    }
    this._updateRawDataValue('type', value);
    return this;
  }

  get owner() {
    return this.getRawDataValue('owner');
  }

  get recycle() {
    return this.getRawDataValue('recycle');
  }

  set recycle(value) {
    this._updateRawDataValue('recycle', !!value);
    return this;
  }

  get locked() {
    return this.getRawDataValue('locked');
  }

  get appdata() {
    // Complex object of version, data
    return this.getRawDataValue('appdata');
  }

  set transitiontime(value) {
    // TODO validate the transition time
    this._updateRawDataValue('transitiontime', Number(value));
    return this;
  }

  set appdata(value) {
    //TODO needs to be an object with version and data fields
    this._updateRawDataValue(value);
    return this;
  }

  get picture() {
    return this.getRawDataValue('picture');
  }

  get lastupdated() {
    return this.getRawDataValue('lastupdated');
  }

  get version() {
    return this.getRawDataValue('version');
  }

  get payload() {
    if (this.isLightStateScene()) {
      return this._generateLightStatePayload();
    } else if (this.isGroupScene()) {
      return this._generateGroupScenePayload();
    } else if (this.isLightScene()) {
      return this._generateLightScenePayload();
    } else {
      throw new ApiError('Scene is not in a valid state');
    }
  }

  isGroupScene() {
    return this.type === 'GroupScene';
  }

  isLightScene() {
    return this.type === 'LightScene';
  }

  isLightStateScene() {
    return this.lightstates && !!this.type;
  }

  _generateLightStatePayload() {
    const result = this._generateCommonPayload();

    //TODO I think that the setting of light states is done in a separate call

    return result;
  }

  _generateLightScenePayload() {
    const result = this._generateCommonPayload();
    result.lights = this.lights;
    result.type = this.type;

    return result;
  }

  _generateGroupScenePayload() {
    const result = this._generateCommonPayload();
    result.group = this.group;
    result.type = this.type;

    return result;
  }

  _generateCommonPayload() {
    const values = this.bridgeData
      , result = {}
    ;

    ['name', 'recycle', 'appdata', 'picture', 'transitiontime'].forEach(key => {
      if (values[key]) {
        result[key] = values[key];
      }
    });

    return result;
  }
};