'use strict';

const expect = require('chai').expect
  , CLIPPresence = require('./CLIPPresence')
;

describe('CLIPPresence', () => {

  it('should create one from valid data', () => {
    const data = {
        name: 'test-presence-sensor',
        config: {
          on: false,
          url: 'https://my-presence.com',
          battery: 100,
          reachable: true
        },
        state: {
          presence: false
        }
      }
      , sensor = new CLIPPresence(1);
    ;
    sensor._populate(data);

    expect(sensor).to.have.property('type').to.equal('CLIPPresence');
    expect(sensor).to.have.property('name').to.equal(data.name);

    expect(sensor).to.have.property('on').to.be.false;
    expect(sensor).to.have.property('url').to.equal(data.config.url);
    expect(sensor).to.have.property('battery').to.equal(data.config.battery);
    expect(sensor).to.have.property('reachable').to.be.true;

    expect(sensor).to.have.property('presence').to.be.false;
  });
});