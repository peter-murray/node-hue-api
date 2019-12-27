'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , ApiError = require('../../index').ApiError
  , testValues = require('../../test/support/testValues.js') //TODO move these
;

describe('Hue API #users', () => {

  let unauthenticatedHue
    , authenticatedHue
  ;

  before(async () => {
    const searchResults = await discovery.nupnpSearch();
    const ipAddress = searchResults[0].ipaddress;
    unauthenticatedHue = await v3Api.createLocal(ipAddress).connect();
    authenticatedHue = await v3Api.createLocal(ipAddress).connect(testValues.username);
  });


  describe('unauthenticated access', () => {

    let createdUser = null;

    describe.skip('#createUser()', () => {

      it('should create a user when the link button has been pressed', async () => {
        const user = await unauthenticatedHue.users.createUser('node-hue-api', 'delete-tests');
        expect(user).to.have.property('username').to.have.length.greaterThan(39);
        expect(user).to.have.property('clientkey');
        createdUser = user;
      });


      it('should not create a new user when link button not pressed', async () => {
        try {
          await unauthenticatedHue.users.createUser('node-hue-api', 'node-hue-api-tests');
          expect.fail('should not get here unless the link button was pressed');
        } catch (err) {
          expect(err).to.be.instanceof(ApiError);
          expect(err.getHueErrorType()).to.equal(101);
        }
      });
    });

    //TODO would need to mock this now as it is based of the modelid of the bridge
    // describe('#createUser() no clientkey', () => {
    //
    //   it('should create a user when the link button has been pressed', async () => {
    //     const user = await unauthenticatedHue.users.createUser('node-hue-api', 'delete-tests', true);
    //     expect(user).to.have.property('username').to.have.length.greaterThan(39);
    //     expect(user).to.not.have.property('clientkey');
    //   });
    // });


    describe.skip('#deleteUser()', () => {

      // it('should delete a user that we created', async () => {
      //   if (!createdUser) {
      //     expect.fail('A user needs to have been created above before we can delete it');
      //   }
      //
      //   const deleted = await authenticatedHue.users.deleteUser(createdUser);
      //   console.log(JSON.stringify(deleted));
      // });

      it('should remove test accounts', async () => {
        const users = await authenticatedHue.users.getByName('node-hue-api', 'node-hue-api-tests');

        expect(users).to.be.instanceof(Array);
        expect(users).to.have.length.greaterThan(0);

        const promises = [];
        users.forEach(user => {
          promises.push(authenticatedHue.users.deleteUser(user.username));
        });

        const deletionResults = await Promise.all(promises);
        console.log(JSON.stringify(deletionResults));
      });
    });
  });


  describe('authenticated access', () => {

    describe('#getAll()', () => {

      it('should get all the users', async () => {
        const allUsers = await authenticatedHue.users.getAll();
        // console.log(JSON.stringify(allUsers, null, 2));

        expect(allUsers).to.be.instanceof(Array);

        expect(allUsers[0]).to.have.property('username');
        expect(allUsers[0]).to.have.property('name');
        expect(allUsers[0]).to.have.property('last use date');
        expect(allUsers[0]).to.have.property('create date');
      });
    });


    describe('#get()', () => {

      it('should get a user by username', async () => {
        const user = await authenticatedHue.users.get(testValues.username);

        expect(user).to.have.property('username').to.equal(testValues.username);
        expect(user).to.have.property('name');
        expect(user).to.have.property('create date');
        expect(user).to.have.property('last use date');
      });

      it('should not find an invalid username', async () => {
        const user = await authenticatedHue.users.get(testValues.username + '0000');

        expect(user).to.be.null;
      });
    });


    describe('#getByName()', () => {

      it('should get a list of user accounts for valid name', async () => {
        const username = 'Echo'
          , users = await authenticatedHue.users.getUserByName(username)
        ;

        expect(users).to.be.instanceof(Array);

        expect(users[0]).to.have.property('name').to.equal(username);
        expect(users[0]).to.have.property('username');
        expect(users[0]).to.have.property('create date');
        expect(users[0]).to.have.property('last use date');
      });


      it('should get a list of user accounts for appName, deviceName', async () => {
        const appName = 'node-hue-api'
          , deviceName = 'my-device'
          , users = await authenticatedHue.users.getByName(appName, deviceName)
        ;

        expect(users).to.be.instanceof(Array);

        expect(users[0]).to.have.property('name').to.equal(`${appName}#${deviceName}`);
        expect(users[0]).to.have.property('username');
        expect(users[0]).to.have.property('create date');
        expect(users[0]).to.have.property('last use date');
      });

      it('should not find a account that does not exist', async () => {
        const users = await authenticatedHue.users.getByName('0000000001');

        expect(users).to.be.instanceOf(Array);
        expect(users).to.be.empty;
      });
    });
  });
});