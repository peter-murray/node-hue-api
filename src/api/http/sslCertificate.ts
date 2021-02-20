import { get, RequestOptions } from 'https';

export type SSLCertificate = {
  serialNumber: string,
  issuer: {
    C: string,
    O: string,
    CN: string,
  },
  subject: {
    CN: string,
    C: string,
    O: string,
  }
  valid_to: string,
  valid_from: string,
  bits: number,
}

export function getSSLCertificate(url: string, timeout?: number): Promise<SSLCertificate> {
  const options = getRequestOptions(url, timeout);
  return performRequest(options);
}

function performRequest(options: RequestOptions): Promise<SSLCertificate> {
  return new Promise((resolve, reject) => {

    get(options, (res) => {
      // @ts-ignore
      const cert: any = res.socket.getPeerCertificate();
      if (!cert || Object.keys(cert).length < 1) {
        reject(`Bridge did not supply a certificate`);
      } else {
        resolve(cert);
      }
    });
  });
}

function getRequestOptions(url: string, timeout?: number): RequestOptions {
  return {
    hostname: url,
    agent: false,
    rejectUnauthorized: false,
    ciphers: 'ALL'
  };
}