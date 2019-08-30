'use strict';

const expect = require('chai').expect
  , bridgeValidation = require('./bridge-validation')
;

describe('bridge-validation', () => {


  describe('#parseXmlDescription()', () => {

    it('should extract description from XML', () => {
      const data = '<root xmlns="urn:schemas-upnp-org:device-1-0">\n' +
        '<specVersion>\n' +
        '<major>1</major>\n' +
        '<minor>0</minor>\n' +
        '</specVersion>\n' +
        '<URLBase>https://192.168.1.130:80/</URLBase>\n' +
        '<device>\n' +
        '<deviceType>urn:schemas-upnp-org:device:Basic:1</deviceType>\n' +
        '<friendlyName>Philips hue (192.168.1.130)</friendlyName>\n' +
        '<manufacturer>Royal Philips Electronics</manufacturer><manufacturerURL>https://www.philips.com</manufacturerURL>\n' +
        '<modelDescription>Philips hue Personal Wireless Lighting</modelDescription>\n' +
        '<modelName>Philips hue bridge 2012</modelName>\n' +
        '<modelNumber>929000226503</modelNumber>\n' +
        '<modelURL>https://www.meethue.com</modelURL>\n' +
        '<serialNumber>001788102201</serialNumber>\n' +
        '<UDN>uuid:2f402f80-da50-11e1-9b23-001788102201</UDN>\n' +
        '<presentationURL>index.html</presentationURL>\n' +
        '<iconList>\n' +
        '<icon>\n' +
        '<mimetype>image/png</mimetype>\n' +
        '<height>48</height>\n' +
        '<width>48</width>\n' +
        '<depth>24</depth>\n' +
        '<url>hue_logo_0.png</url>\n' +
        '</icon>\n' +
        '<icon>\n' +
        '<mimetype>image/png</mimetype>\n' +
        '<height>120</height>\n' +
        '<width>120</width>\n' +
        '<depth>24</depth>\n' +
        '<url>hue_logo_3.png</url>\n' +
        '</icon>\n' +
        '</iconList>\n' +
        '</device>\n' +
        '</root>';

      const result = bridgeValidation.parseXmlDescription(data);

      expect(result).to.have.property('name').to.equal('Philips hue (192.168.1.130)');
      expect(result).to.have.property('manufacturer').to.equal('Royal Philips Electronics');
      expect(result).to.have.property('ipaddress').to.equal('192.168.1.130');

      expect(result).to.have.property('model');
      expect(result.model).to.have.property('number').to.equal('929000226503');
      expect(result.model).to.have.property('description').to.equal('Philips hue Personal Wireless Lighting');
      expect(result.model).to.have.property('name').to.equal('Philips hue bridge 2012');
      expect(result.model).to.have.property('serial').to.equal('001788102201');

      expect(result).to.have.property('icons');
      expect(result.icons).to.be.instanceOf(Array);

      expect(result.icons[0]).to.have.property('mimetype').to.equal('image/png');
      expect(result.icons[0]).to.have.property('height').to.equal('48');
      expect(result.icons[0]).to.have.property('width').to.equal('48');
      expect(result.icons[0]).to.have.property('depth').to.equal('24');
      expect(result.icons[0]).to.have.property('url').to.equal('hue_logo_0.png');

      expect(result.icons[1]).to.have.property('mimetype').to.equal('image/png');
      expect(result.icons[1]).to.have.property('height').to.equal('120');
      expect(result.icons[1]).to.have.property('width').to.equal('120');
      expect(result.icons[1]).to.have.property('depth').to.equal('24');
      expect(result.icons[1]).to.have.property('url').to.equal('hue_logo_3.png');
    });
  });
});