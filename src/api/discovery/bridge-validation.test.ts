import {expect} from 'chai';

import * as bridgeValidation from './bridge-validation';
import { mDNSSearch } from "./mDNS";

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
      expect(result.icons).to.be.instanceOf(Array).to.have.length.greaterThan(0);

      // @ts-ignore
      let icon = result.icons[0];
      expect(icon).to.have.property('mimetype').to.equal('image/png');
      expect(icon).to.have.property('height').to.equal('48');
      expect(icon).to.have.property('width').to.equal('48');
      expect(icon).to.have.property('depth').to.equal('24');
      expect(icon).to.have.property('url').to.equal('hue_logo_0.png');

      // @ts-ignore
      icon = result.icons[1];
      expect(icon).to.have.property('mimetype').to.equal('image/png');
      expect(icon).to.have.property('height').to.equal('120');
      expect(icon).to.have.property('width').to.equal('120');
      expect(icon).to.have.property('depth').to.equal('24');
      expect(icon).to.have.property('url').to.equal('hue_logo_3.png');
    });
  });

  describe('#getBridgeConfig()', () => {

    it('should get config on a valid bridge', async function(){
      this.timeout(10000);

      const bridges = await new mDNSSearch().search();
      expect(bridges).to.have.length.greaterThan(0);
      const bridge = bridges[0];

      const config = await bridgeValidation.getBridgeConfig(bridge, 5000);

      expect(config).to.have.property('name');
      expect(config).to.have.property('ipaddress').to.equal(bridge.internalipaddress);
      expect(config).to.have.property('modelid');
      expect(config).to.have.property('swversion');
    });

    it('should fail for invalid ip address', async function() {
      const ipAddress = '10.0.0.1'
        , timeout = 2000
      ;

      // Make test time out double that of the actual timeout on the request
      this.timeout(timeout * 2);

      try {
        await bridgeValidation.getBridgeConfig({internalipaddress: ipAddress}, timeout);
        expect.fail('Should have failed');
      } catch (err: any) {
        expect(err.message).to.contain('network timeout');
      }
    });
  });

  describe('#getBridgeDescription()', () => {

    it('should get config on a valid bridge', async function(){
      this.timeout(10000);

      const bridges = await new mDNSSearch().search();
      expect(bridges).to.have.length.greaterThan(0);
      const bridge = bridges[0];

      const config = await bridgeValidation.getBridgeDescription(bridge, 5000);

      expect(config).to.have.property('name').to.include('Philips hue');
      expect(config).to.have.property('ipaddress').to.equal(bridge.internalipaddress);

      expect(config).to.have.property('model');
      expect(config.model).to.have.property('number').to.equal('BSB002');
      expect(config.model).to.have.property('name');
      expect(config.model).to.have.property('description');
    });

    it('should fail for invalid ip address', async function() {
      const ipAddress = '10.0.0.1'
        , timeout = 2000
        ;

      // Make test time out double that of the actual timeout on the request
      this.timeout(timeout * 2);

      try {
        await bridgeValidation.getBridgeDescription({internalipaddress: ipAddress}, timeout);
        expect.fail('Should have failed');
      } catch (err: any) {
        expect(err.message).to.contain('network timeout');
      }
    });
  });
});