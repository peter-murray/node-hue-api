const testValues = require('../../test/support/testValues.js');
const expect = require('chai').expect;
const discovery = require('../index').discovery
const createLocal = require('./index').createLocal;
const createInsecureLocal = require('./index').createInsecureLocal;

describe('Hue API create for local connections', () => {

  let hueLocalIpAddress;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        expect(searchResults).to.be.instanceOf(Array);
        expect(searchResults).to.have.length.greaterThan(0);

        expect(searchResults[0]).to.not.have.property('error');
        hueLocalIpAddress = searchResults[0].ipaddress;
      });
  });

  describe('#createLocal()', () => {

    it('should get a local connection', async () => {
      const bootstrap = await createLocal(hueLocalIpAddress);
      expect(bootstrap).to.not.be.null;

      const api = await bootstrap.connect(testValues.username);
      expect(api).to.not.be.null;
    });
  });

  describe('#createInsecureLocal()', () => {

    it('should get an insecure local connection', async () => {
      const bootstrap = await createInsecureLocal(hueLocalIpAddress);
      expect(bootstrap).to.not.be.null;

      const api = await bootstrap.connect(testValues.username);
      expect(api).to.not.be.null;
    });
  });
});