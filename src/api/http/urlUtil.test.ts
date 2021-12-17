import {expect} from 'chai';
import { getHttpsUrl, isIpv6Host } from './urlUtil';


const IPV6_EXPANDED = '0000:0000:0000:0000:0000:ffff:c0a8:0a28'
  , IPV6_SHORTENED = '0:0:0:0:0:ffff:c0a8:0a28'
  , IPV6_COMPRESSED = '::ffff:c0a8:a28'
;

describe('urlUtil', () => {

  describe('#isIpv6Host()', () => {

    it('should identify ipv6 expanded', () => {
      expect(isIpv6Host(IPV6_EXPANDED)).to.be.true;
    });

    it('should identify ipv6 shortened', () => {
      expect(isIpv6Host(IPV6_SHORTENED)).to.be.true;
    });

    it('should identify ipv6 compressed', () => {
      expect(isIpv6Host(IPV6_COMPRESSED)).to.be.true;
    });

    it('should identify ipv6 in brackets', () => {
      expect(isIpv6Host(`[${IPV6_EXPANDED}]`)).to.be.true;
      expect(isIpv6Host(`[${IPV6_SHORTENED}]`)).to.be.true;
      expect(isIpv6Host(`[${IPV6_COMPRESSED}]`)).to.be.true;
    });

    it('should not match a hostname', () => {
      expect(isIpv6Host('hue-bridge')).to.be.false;
      expect(isIpv6Host('hue-bridge.local')).to.be.false;
      expect(isIpv6Host('hue-bridge.domain.com')).to.be.false;
    });

    it ('should not match an IPv4 address', () => {
      expect(isIpv6Host('192.168.2.1')).to.be.false;
      expect(isIpv6Host('10.0.0.5')).to.be.false;
    });
  });

  describe('#getHttpsUrl()', () => {

    it('should get a URL using a hostname', () => {
      let url = getHttpsUrl('hue', 443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal('hue');
      expect(url).to.have.property('port').to.equal('');

      url = getHttpsUrl('hue.local', 8443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal('hue.local');
      expect(url).to.have.property('port').to.equal('8443');
    });

    it('should get a URL using an IPv4 address', () => {
      let url = getHttpsUrl('192.168.2.1', 443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal('192.168.2.1');
      expect(url).to.have.property('port').to.equal('');

      url = getHttpsUrl('10.0.0.5', 9443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal('10.0.0.5');
      expect(url).to.have.property('port').to.equal('9443');
    });

    it('should get a URL using an IPv6 compressed address', () => {
      let url = getHttpsUrl(IPV6_COMPRESSED, 443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('');

      url = getHttpsUrl(IPV6_COMPRESSED, 9443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('9443');

      url = getHttpsUrl(`[${IPV6_COMPRESSED}]`, 10443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('10443');
    });

    it('should get a URL using an IPv6 shortened address', () => {
      let url = getHttpsUrl(IPV6_SHORTENED, 443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('');

      url = getHttpsUrl(IPV6_SHORTENED, 9443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('9443');

      url = getHttpsUrl(`[${IPV6_SHORTENED}]`, 10443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('10443');
    });

    it('should get a URL using an IPv6 expanded address', () => {
      let url = getHttpsUrl(IPV6_EXPANDED, 443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('');

      url = getHttpsUrl(IPV6_EXPANDED, 9443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('9443');

      url = getHttpsUrl(`[${IPV6_EXPANDED}]`, 10443);
      expect(url).to.have.property('protocol').to.equal('https:');
      expect(url).to.have.property('hostname').to.equal(`[${IPV6_COMPRESSED}]`);
      expect(url).to.have.property('port').to.equal('10443');
    });
  });
});