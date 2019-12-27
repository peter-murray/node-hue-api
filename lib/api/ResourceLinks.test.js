'use strict';

const expect = require('chai').expect
  , v3Api = require('../v3').api
  , discovery = require('../v3').discovery
  , testValues = require('../../test/support/testValues.js')
  , model = require('../model')
;


describe('Hue API #resourceLinks', () => {

  let hue;

  before(() => {
    return discovery.nupnpSearch()
      .then(searchResults => {
        const localApi = v3Api.createLocal(searchResults[0].ipaddress);
        return localApi.connect(testValues.username)
          .then(api => {
            hue = api;
          });
      });
  });


  describe('#getAll()', () => {

    it('should get all resource links', async () => {
      const resourceLinks = await hue.resourceLinks.getAll();

      expect(resourceLinks).to.be.instanceOf(Array);
      const resourceLink = resourceLinks[0];
      // console.log(resourceLink.toStringDetailed());
      expect(model.isResourceLinkInstance(resourceLink)).to.be.true;
    });
  });


  describe('#get()', () => {

    it('should get a resource link that exists using an id', async () => {
      const allResourceLinks = await hue.resourceLinks.getAll()
        , targetResourceLink = allResourceLinks[allResourceLinks.length - 1]
      ;

      const resourceLink = await hue.resourceLinks.getResourceLink(targetResourceLink.id);
      expect(model.isResourceLinkInstance(resourceLink)).to.be.true;
      expect(resourceLink).to.have.property('id').to.equal(targetResourceLink.id);

      //TODO need to do a deep equals on contents against targetResourceLink
      expect(resourceLink).to.have.property('name').to.equal(targetResourceLink.name);
    });

    it('should get a resource link that exists using a ResourceLink', async () => {
      const allResourceLinks = await hue.resourceLinks.getAll()
        , targetResourceLink = allResourceLinks[allResourceLinks.length - 1]
      ;

      const resourceLink = await hue.resourceLinks.getResourceLink(targetResourceLink);
      expect(model.isResourceLinkInstance(resourceLink)).to.be.true;
      expect(resourceLink).to.have.property('id').to.equal(targetResourceLink.id);

      //TODO need to do a deep equals on contents against targetResourceLink
      expect(resourceLink).to.have.property('name').to.equal(targetResourceLink.name);
    });

    //TODO test get failure
  });


  describe('#createResourceLink()', () => {

    let createdResourceLinkId;

    beforeEach(() => {
      createdResourceLinkId = null;
    });

    afterEach(async () => {
      if (createdResourceLinkId) {
        await hue.resourceLinks.deleteResourceLink(createdResourceLinkId);
      }
    });

    it('should create a resource link', async () => {
      const resourceLink = model.createResourceLink();
      resourceLink.name = 'Test ResourceLink';
      resourceLink.description = 'A test resource link for node-hue-api';
      resourceLink.recycle = true;
      resourceLink.classid = 100;
      resourceLink.addLink('groups', 0);

      const result = await hue.resourceLinks.createResourceLink(resourceLink);
      expect(model.isResourceLinkInstance(result)).to.be.true;
      createdResourceLinkId = result.id;

      expect(result).to.have.property('name').to.equal(resourceLink.name);
      expect(result).to.have.property('description').to.equal(resourceLink.description);
      expect(result).to.have.property('recycle').to.equal(resourceLink.recycle);
      expect(result).to.have.property('classid').to.equal(resourceLink.classid);

      expect(result).to.have.property('links').to.have.property('groups').to.have.members(['0']);

      // Owner should be set on resultant ResourceLinks
      expect(result).to.have.property('owner').to.equal(testValues.username);
    });


    it('should fail to create on an incomplete resource link', async () => {
      const resourceLink = model.createResourceLink();
      resourceLink.name = 'Test Resource Link';
      resourceLink.description = 'A test resource link for node-hue-api';
      resourceLink.recycle = true;

      try {
        await hue.resourceLinks.createResourceLink(resourceLink);
        expect.fail('Should have thrown exception above');
      } catch (err) {
        expect(err.message).to.contain('some links defined');
      }
    });
  });


  describe('#deleteResourceLink()', () => {

    it('should delete an existing resource link', async () => {
      const resourceLink = model.createResourceLink();
      resourceLink.name = 'Test ResourceLink to be deleted';
      resourceLink.description = 'A test resource link for node-hue-api';
      resourceLink.recycle = true;
      resourceLink.classid = 1;
      resourceLink.addLink('groups', 0);

      const createdResourceLink = await hue.resourceLinks.createResourceLink(resourceLink);
      expect(createdResourceLink).to.have.property('id');

      const result = await hue.resourceLinks.deleteResourceLink(createdResourceLink.id);
      expect(result).to.be.true;
    });
  });


  describe('#updateResourceLink()', () => {

    let existingResourceLink;

    beforeEach(async () => {
      const resourceLink = model.createResourceLink();
      resourceLink.name = 'Update Resource Link Tests';
      resourceLink.description = 'A test resource link for node-hue-api';
      resourceLink.recycle = true;
      resourceLink.classid = 1;
      resourceLink.addLink('groups', 0);

      existingResourceLink = await hue.resourceLinks.createResourceLink(resourceLink);
    });

    afterEach(async () => {
      if (existingResourceLink) {
        await hue.resourceLinks.deleteResourceLink(existingResourceLink);
      }
    });


    it('should update the name of a resource link', async () => {
      const newName = `RL ${Date.now()}`;

      existingResourceLink.name = newName;

      const updated = await hue.resourceLinks.updateResourceLink(existingResourceLink);
      expect(updated).to.have.property('name').to.be.true;
      expect(updated).to.have.property('description').to.be.true;
      expect(updated).to.have.property('classid').to.be.true;
      expect(updated).to.have.property('links').to.be.true;

      const resourceLink = await hue.resourceLinks.getResourceLink(existingResourceLink.id);
      expect(resourceLink).to.have.property('name').to.equal(newName);
    });
  });
});