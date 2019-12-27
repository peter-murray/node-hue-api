'use strict';

const expect = require('chai').expect
  , ResourceLink = require('./ResourceLink')
;

describe('ResourceLink', () => {

  const resourceLinkData = {
    name: 'HueLabs 2.0',
    description: 'All installed formulas',
    type: 'Link',
    classid: 1,
    owner: '985692e7-6abf-4043-b20e-30d75c0ab864',
    recycle: false,
    links: [
      '/resourcelinks/48840',
      '/resourcelinks/62738',
      '/scenes/ABCD',
      '/scenes/XYZ',
      '/schedules/3',
      '/sensors/188136',
      '/sensors/4578921',
      '/groups/10'
    ]
  };

  describe('#create()', () => {

    it('should create a resource link', () => {
      const resourceLink = new ResourceLink(0);
      resourceLink._populate(resourceLinkData);

      expect(resourceLink).to.have.property('id').to.equal(0);
      expect(resourceLink).to.have.property('name').to.equal(resourceLinkData.name);
      expect(resourceLink).to.have.property('description').to.equal(resourceLinkData.description);
      expect(resourceLink).to.have.property('type').to.equal(resourceLinkData.type);
      expect(resourceLink).to.have.property('classid').to.equal(resourceLinkData.classid);
      expect(resourceLink).to.have.property('owner').to.equal(resourceLinkData.owner);
      expect(resourceLink).to.have.property('recycle').to.equal(resourceLinkData.recycle);

      expect(resourceLink).to.have.property('links');
      expect(resourceLink.links).to.have.property('resourcelinks').to.be.an.instanceOf(Array).to.have.length(2);
      expect(resourceLink.links).to.have.property('scenes').to.be.an.instanceOf(Array).to.have.length(2);
      expect(resourceLink.links).to.have.property('schedules').to.be.an.instanceOf(Array).to.have.length(1);
      expect(resourceLink.links).to.have.property('sensors').to.be.an.instanceOf(Array).to.have.length(2);
      expect(resourceLink.links).to.have.property('groups').to.be.an.instanceOf(Array).to.have.length(1);
    });
  });


  describe('adding/removing links', () => {

    let resourceLink;

    beforeEach(() => {
      resourceLink = new ResourceLink();
      resourceLink._populate(resourceLinkData);
    });


    it('should remove an existing link', () => {
      expect(resourceLink.links).to.have.property('groups').to.have.length(1);
      resourceLink.removeLink('groups', 10);
      expect(resourceLink.links).to.have.property('groups').to.have.length(0);
    });

    it('should remove an existing link when there are multiples', () => {
      expect(resourceLink.links).to.have.property('sensors').to.have.length(2);
      resourceLink.removeLink('sensors', 188136);
      expect(resourceLink.links).to.have.property('sensors').to.have.length(1);
    });

    it('should not remove anything it cannot match', () => {
      const originalLinks = Object.assign({}, resourceLink.links);

      resourceLink.removeLink('sensors', 0);
      resourceLink.removeLink('groups', 48840);
      resourceLink.removeLink('schedules', 19);

      expect(resourceLink.links).to.deep.equals(originalLinks)
    });


    it('should add a new group link', () => {
      const originalLinksGroupsCount = resourceLink.links.groups.length
        , groupId = 1234978
      ;

      resourceLink.addLink('groups', groupId);
      expect(resourceLink.links).to.have.property('groups').to.have.length(originalLinksGroupsCount + 1);

      const groups = resourceLink.links.groups;
      expect(groups[groups.length - 1]).to.equal(groupId);
    });


    //TODO add links
  });

});