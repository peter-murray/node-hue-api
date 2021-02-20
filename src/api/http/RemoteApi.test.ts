import { RemoteBootstrap } from './RemoteBootstrap';
import {expect} from 'chai';

//TODO do not commit this
// Values for the ClientId, ClientSecret and AppId from the Hue Remote Application you create in your developer account.
const CLIENT_ID = 'iiY946HrYrrAz0JdW9RLjtLG5ZB1yeIW'
  , CLIENT_SECRET = 'OSaOkbM8fVFaZXUx'
;

describe('RemoteApi', () => {

  describe('connectWithCode()', () => {

    it.skip('should connect using a valid code', async () => {
    // it('should connect using a valid code', async () => {
      const code = 'FTOdGomQ'; // Code from the authorization code call

      const remoteBootstrap = new RemoteBootstrap(CLIENT_ID, CLIENT_SECRET);
      const result = await remoteBootstrap.connectWithCode(code);
      expect(result).to.not.be.undefined;
    });
  });
});
