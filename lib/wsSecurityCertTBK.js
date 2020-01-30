import ejs from 'ejs';
import { createPrivateKey, createPublicKey } from 'crypto';
import uuid from 'uuid';
import { promisify } from 'util';
import pem from 'pem';
import { SignedXml } from 'xml-crypto';


import tbkHeader from '../templates/tbkHeader';
import tbkToken from '../templates/tbkToken';

const wsseSecurityHeaderTemplate = ejs.compile(tbkHeader);
const wsseSecurityTokenTemplate = ejs.compile(tbkToken);

const insertStr = (src, dst, pos) => [dst.slice(0, pos), src, dst.slice(pos)].join('');
const generateId = () => uuid.v4().replace(/-/gm, '');
const readCertificateInfoPromise = promisify(pem.readCertificateInfo);

export default (privatePEM, publicP12PEM) => {
  const tbkSecurity = {};
  tbkSecurity.signer = new SignedXml();

  return Promise.resolve(createPrivateKey(privatePEM))
    .then(
      (privateKey) => {
        tbkSecurity.privateKey = privateKey;
        return createPublicKey(publicP12PEM);
      },
    )
    .then(
      (publicKey) => {
        tbkSecurity.publicP12PEM = publicKey.replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '').replace(/(\r\n|\n|\r)/gm, '');
        tbkSecurity.signer.signingKey = tbkSecurity.privateKey.toPrivatePem();
        tbkSecurity.x509Id = `x509-${generateId()}`;

        return readCertificateInfoPromise(tbkSecurity.publicP12PEM);
      },
    )
    .then(
      (pemData) => {
        tbkSecurity.certSerial = '';
        if (!Number.isNaN(parseInt(pemData.serial.split(' ')[0], 10)) && pemData.serial.indexOf(':') < 0) {
          [tbkSecurity.certSerial] = pemData.serial.split(' ');
        } else {
          const tokens = pemData.serial.split(':');
          tokens.reduce((acc, elem) => `${acc}${parseInt(`0x${elem}`, 10)}`, '');
        }
        tbkSecurity.issuer = `C=${pemData.issuer.country},ST=${pemData.issuer.state},O=${pemData.issuer.organization},L=${pemData.issuer.locality},CN=${pemData.commonName},OU=${pemData.organizationUnit},emailAddress=${pemData.emailAddress}`;

        const references = [
          'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
          'http://www.w3.org/2001/10/xml-exc-c14n#',
        ];

        tbkSecurity.signer.addReference("//*[local-name(.)='Body']", references);

        tbkSecurity.signer.keyInfoProvider = {};
        tbkSecurity.signer.keyInfoProvider.getKeyInfo = () => (
          wsseSecurityTokenTemplate(
            {
              cert: tbkSecurity.publicP12PEM,
              serialNumber: tbkSecurity.certSerial,
              issuerName: tbkSecurity.issuer,
            },
          )
        );

        tbkSecurity.postProcess = (xml) => {
          const secHeader = wsseSecurityHeaderTemplate({
            cert: this.publicP12PEM,
            serialNumber: this.certSerial,
            issuerName: this.issuer,
          });

          const xmlWithSec = insertStr(secHeader, xml, xml.indexOf('</soap:Header>'));
          this.signer.computeSignature(xmlWithSec);
          const retXml = insertStr(this.signer.getSignatureXml(), xmlWithSec, xmlWithSec.indexOf('</wsse:Security>'));

          console.debug(`[DEBUG] TBK signer | Input XML > ${retXml}`);

          return retXml;
        };

        return tbkSecurity;
      },
    );
  // It is the user responsability to check for errors in this promise
};
