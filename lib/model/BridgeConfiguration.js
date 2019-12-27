'use strict';

const BridgeObject = require('./BridgeObject')
  , types = require('../types')
;

const ATTRIBUTES = [
  // Modifiable Attributes
  types.uint16({name: 'proxyport'}),
  types.string({name: 'proxyaddress', minLength: 0, maxLength: 40}),
  types.string({name: 'name', minLength: 4, maxLength: 16}),
  types.boolean({name: 'linkbutton'}), // Only works on the portal not in local network
  types.string({name: 'ipaddress'}),
  types.string({name: 'netmask'}),
  types.string({name: 'gateway'}),
  types.boolean({name: 'dhcp'}),
  types.string({name: 'timezone'}),
  types.boolean({name: 'touchlink'}),
  types.choice({name: 'zigbeechannel', validValues: [11, 15, 20, 25]}),
  types.string({name: 'UTC'}),

  // R/O attributes
  types.string({name: 'localtime'}),
  types.object({
    name: 'swupdate2',
    types: [
      types.boolean({name: 'checkforupdate'}),
      types.string({name: 'lastchange'}), // This is an iso time format
      types.choice({
        name: 'state',
        validValues: [
          'unknown',
          'noupdates',
          'transferring',
          'anyreadytoinstall',
          'allreadtoinstall',
          'installing',
        ]
      }),
      types.object({
        name: 'autoinstall',
        types: [
          types.string({name: 'updatetime'}),
          types.boolean({name: 'on'}),
        ]
      }),
      types.object({
        name: 'bridge',
        types: [
          types.string({name: 'state'}),
          types.string({name: 'lastinstall'}),
        ]
      }),
    ]
  }),
  types.object({name: 'whitelist'}),
  types.boolean({name: 'portalservices'}),
  types.string({name: 'portalconnection'}),
  types.object({
    name: 'portalstate',
    types: [
      types.boolean({name: 'signedon'}),
      types.boolean({name: 'incoming'}),
      types.boolean({name: 'outgoing'}),
      types.string({name: 'communication'}),
    ]
  }),
  types.object({
    name: 'internetservices',
    types: [
      types.choice({name: 'internet', validValues: ['connected', 'disconnected']}),
      types.choice({name: 'remoteaccess', validValues: ['connected', 'disconnected']}),
      types.choice({name: 'time', validValues: ['connected', 'disconnected']}),
      types.choice({name: 'swupdate', validValues: ['connected', 'disconnected']}),
    ]
  }),
  types.object({
    name: 'backup',
    types: [
      types.choice({
        name: 'status',
        validValues: ['idle', 'startmigration', 'fileready_disabled', 'prepare_restore', 'restoring']
      }),
      types.uint8({name: 'errorcode'}),
    ]
  }),
  types.string({name: 'apiversion'}),
  types.string({name: 'swversion'}),
  types.string({name: 'mac'}),
  types.string({name: 'modelid'}),
  types.string({name: 'bridgeid'}),
  types.boolean({name: 'factorynew'}),
  types.string({name: 'replacesbridgeid'}),
  types.string({name: 'datastoreversion'}),
  types.string({name: 'starterkitid'}),
];

/**
 * @typedef { import('../types/Type') } Type
 * @type {BridgeObjectWithId}
 */
module.exports = class BridgeConfiguration extends BridgeObject {

  constructor() {
    super(ATTRIBUTES);
  }

  set proxyport(value) {
    return this.setAttributeValue('proxyport', value);
  }

  set proxyaddress(value) {
    return this.setAttributeValue('proxyaddress', value);
  }

  set name(value) {
    return this.setAttributeValue('name', value);
  }

  set linkbutton(value) {
    return this.setAttributeValue('linkbutton', value);
  }

  set ipaddress(value) {
    return this.setAttributeValue('ipaddress', value);
  }

  set netmask(value) {
    return this.setAttributeValue('netmask', value);
  }

  set gateway(value) {
    return this.setAttributeValue('gateway', value);
  }

  set dhcp(value) {
    return this.setAttributeValue('dhcp', value);
  }

  set timezone(value) {
    return this.setAttributeValue('timezone', value);
  }

  set touchlink(value) {
    return this.setAttributeValue('touchlink', value);
  }

  set zigbeechannel(value) {
    return this.setAttributeValue('zigbeechannel', value);
  }

  /**
   * Sets the time in UTC on the bridge, but only if there is internet connection (as it will use the internet for the time)
   * @param value An iso time format
   * @returns {BridgeObject}
   */
  set UTC(value) {
    return this.setAttributeValue('UTC', value);
  }

  get portalservices() {
    return this.getAttributeValue('portalservices');
  }

  get portalconnection() {
    return this.getAttributeValue('portalconnection');
  }

  get portalstate() {
    return this.getAttributeValue('portalstate');
  }

  get localtime() {
    return this.getAttributeValue('localtime');
  }

  get proxyport() {
    return this.getAttributeValue('proxyport');
  }

  get proxyaddress() {
    return this.getAttributeValue('proxyaddress');
  }

  get name() {
    return this.getAttributeValue('name');
  }

  get linkbutton() {
    return this.getAttributeValue('linkbutton');
  }

  get ipaddress() {
    return this.getAttributeValue('ipaddress');
  }

  get netmask() {
    return this.getAttributeValue('netmask');
  }

  get gateway() {
    return this.getAttributeValue('gateway');
  }

  get dhcp() {
    return this.getAttributeValue('dhcp');
  }

  get timezone() {
    return this.getAttributeValue('timezone');
  }

  get zigbeechannel() {
    return this.getAttributeValue('zigbeechannel');
  }

  get UTC() {
    return this.getAttributeValue('UTC');
  }

  get swupdate2() {
    return this.getAttributeValue('swupdate2');
  }

  get whitelist() {
    return this.getAttributeValue('whitelist');
  }

  get internetservices() {
    return this.getAttributeValue('internetservices');
  }

  get backup() {
    return this.getAttributeValue('backup');
  }

  get apiversion() {
    return this.getAttributeValue('apiversion');
  }

  get swversion() {
    return this.getAttributeValue('swversion');
  }

  get mac() {
    return this.getAttributeValue('mac');
  }

  get modelid() {
    return this.getAttributeValue('modelid');
  }

  get bridgeid() {
    return this.getAttributeValue('bridgeid');
  }

  get factorynew() {
    return this.getAttributeValue('factorynew');
  }

  get replacesbridgeid() {
    return this.getAttributeValue('replacesbridgeid');
  }

  get datastoreversion() {
    return this.getAttributeValue('datastoreversion');
  }

  get starterkitid() {
    return this.getAttributeValue('starterkitid');
  }
};