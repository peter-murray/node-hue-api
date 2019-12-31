'use strict';

const expect = require('chai').expect
  , HueApiConfig = require('./HueApiConfig')
  , Transport = require('./http/Transport')
  , RemoteApi = require('./http/RemoteApi')
  , ApiError = require('../ApiError')
;

const BASE_URL = 'https://localhost:443'
  , DUMMY_CLIENT_KEY = 'aaaaaaaaaaaaaaaaaa'
  , DUMMY_CLIENT_SECRET = 'abcd1234567890'
  , DUMMY_CLIENT_ID = 'abcd1234567890abc'
  , USERNAME = 'xxxxxxxxxxxxxxxxxxxx'
;


describe('HueApiConfig', () => {

  const dummyTransport = new Transport(null, null, null);

  describe('Remote API', () => {

    const dummyRemoteApi = new RemoteApi(null, null);

    let config;

    beforeEach(() => {
      config = new HueApiConfig({
          remote: true,
          username: USERNAME,
          baseUrl: BASE_URL,
          clientSecret: DUMMY_CLIENT_SECRET,
          clientId: DUMMY_CLIENT_ID
        },
        dummyTransport,
        dummyRemoteApi
      );
    });

    it('should get #baseURL', () => {
      expect(config.baseUrl).to.equal(BASE_URL);
    });

    it('should get #username', () => {
      expect(config.username).to.equal(USERNAME);
    });

    it('should identify a remote API', () => {
      expect(config.isRemote).to.be.true;
      expect(config.transport).to.equal(dummyTransport);
      expect(config.remote).to.equal(dummyRemoteApi);
    });


    it('should get #clientSecret and #clientId', () => {
      expect(config.clientSecret).to.equal(DUMMY_CLIENT_SECRET);
      expect(config.clientId).to.equal(DUMMY_CLIENT_ID);
    });


    it('should fail on #clientKey', () => {
      try {
        config.clientKey;
      } catch (err) {
        expect(err.message).to.contain('only valid on a local Hue API instance');
      }
    });
  });


  describe('Local API', () => {

    let config;

    beforeEach(() => {
      config = new HueApiConfig({
          baseUrl: BASE_URL,
          username: USERNAME,
          clientkey: DUMMY_CLIENT_KEY,
        },
        dummyTransport);
    });

    it('should get #baseURL', () => {
      expect(config.baseUrl).to.equal(BASE_URL);
    });

    it('should get #username', () => {
      expect(config.username).to.equal(USERNAME);
    });

    it('should get #clientKey', () => {
      expect(config.clientKey).to.equal(DUMMY_CLIENT_KEY);
    });

    it('should error on #remote', () => {
      try {
        config.remote;
      } catch (err) {
        expect(err).to.be.instanceOf(ApiError);
        expect(err.message).to.contain('not been set up as a remote API');
      }
    });
  });
});
