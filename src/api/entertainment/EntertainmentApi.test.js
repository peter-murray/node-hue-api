'use strict';

const expect = require('chai').expect
  , HueApi = require('../../v3').api
  , discovery = require('../../v3').discovery
  , testValues = require('../../../test/support/testValues.js') //TODO move these
;

const ENTERTAINMENT_GROUP_ID = 29;

describe.skip('Hue Entertainment API', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        return HueApi.create(searchResults[0].ipaddress, testValues.username, testValues.clientkey)
          .then(api => {
            hue = api;
          });
      });
  });


  describe('#start()', () => {

    it('should start the Entertainment API', async () => {
      expect(hue.entertainment).to.not.be.undefined;
      const entertainment = await hue.entertainment.start(ENTERTAINMENT_GROUP_ID);

      const stopped = await entertainment.stop();
      expect(stopped).to.be.true;
    });

  });


  describe('#sendRGB()', function () {

    this.timeout(20000);


    it('should send an RGB payload', async () => {
      const changes = [
        {
          39: [255, 0, 0],
          40: [0, 255, 0]
        },
        {
          39: [0, 255, 0],
          40: [255, 0, 0]
        }
      ];


      expect(hue.entertainment).to.not.be.undefined;
      const entertainment = await hue.entertainment.start(ENTERTAINMENT_GROUP_ID);

      const start = Date.now()
        , end = start + (10 * 1000)
      ;

      let idx = 0
        , time = Date.now()
      ;

      do {
        const now = Date.now();

        if (now - time > 500) {
          console.log('Changing index');
          idx++;
          time = now;


          if (idx >= changes.length) {
            idx = 0;
          }

          const result = entertainment.sendRGB(changes[idx]);
          console.log(result);
        }

      } while (Date.now() <= end);

      const stopped = await entertainment.stop();
      expect(stopped).to.be.true;
    });

  });

});
