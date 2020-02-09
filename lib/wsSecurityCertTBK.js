const ejs = require('ejs');
const uuid = require('uuid');
const { promisify } = require('util');
const pem = require('pem');
const { SignedXml } = require('xml-crypto');


const tbkHeader = require('../templates/tbkHeader');
const tbkToken = require('../templates/tbkToken');

const wsseSecurityHeaderTemplate = ejs.compile(tbkHeader);
const wsseSecurityTokenTemplate = ejs.compile(tbkToken);

const insertStr = (src, dst, pos) => [dst.slice(0, pos), src, dst.slice(pos)].join('');
const generateId = () => uuid.v4().replace(/-/gm, '');
const readCertificateInfoPromise = promisify(pem.readCertificateInfo);

module.exports = (privatePEM, publicP12PEM) => {
  const tbkSecurity = {};
  tbkSecurity.signer = new SignedXml();
  tbkSecurity.publicP12PEM = publicP12PEM
    .replace('-----BEGIN CERTIFICATE-----', '')
    .replace('-----END CERTIFICATE-----', '')
    .replace(/(\r\n|\n|\r)/gm, '');
  tbkSecurity.signer.signingKey = privatePEM;
  tbkSecurity.x509Id = `x509-${generateId()}`;

  return readCertificateInfoPromise(publicP12PEM)
    .then(
      (pemData) => {
        tbkSecurity.certSerial = '';
        if (!Number.isNaN(parseInt(pemData.serial.split(' ')[0], 10)) && pemData.serial.indexOf(':') < 0) {
          [tbkSecurity.certSerial] = pemData.serial.split(' ');
        } else {
          const tokens = pemData.serial.split(':');
          tbkSecurity.certSerial = tokens.reduce((acc, elem) => `${acc}${parseInt(`0x${elem}`, 16)}`, '');
        }
        tbkSecurity.issuer = `C=${pemData.issuer.country},ST=${pemData.issuer.state},O=${pemData.issuer.organization},L=${pemData.issuer.locality},CN=${pemData.commonName},OU=${pemData.organizationUnit},emailAddress=${pemData.emailAddress}`;

        const references = [
          'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
          'http://www.w3.org/2001/10/xml-exc-c14n#',
        ];

        tbkSecurity.signer.addReference("//*[local-name(.)='Body']", references);

        tbkSecurity.signer.keyInfoProvider = {};
        tbkSecurity.signer.keyInfoProvider.getKeyInfo = () => wsseSecurityTokenTemplate(
          {
            cert: tbkSecurity.publicP12PEM,
            serialNumber: tbkSecurity.certSerial,
            issuerName: tbkSecurity.issuer,
          },
        );

        tbkSecurity.postProcess = (xml) => {
          const secHeader = wsseSecurityHeaderTemplate({
            cert: tbkSecurity.publicP12PEM,
            serialNumber: tbkSecurity.certSerial,
            issuerName: tbkSecurity.issuer,
          });

          const xmlWithSec = insertStr(secHeader, xml, xml.indexOf('</soap:Header>'));
          tbkSecurity.signer.computeSignature(xmlWithSec);
          const retXml = insertStr(tbkSecurity.signer.getSignatureXml(), xmlWithSec, xmlWithSec.indexOf('</wsse:Security>'));
          return retXml.replace(' xmlns:wsse=""', '');
        };

        return tbkSecurity;
      },
    );
  // It is the user responsability to check for errors in this promise
};
