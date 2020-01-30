import fs from 'fs';
import { resolve } from 'path';
import soap from 'soap';
import tbkSecurity from '../index';


describe('TBK Signer tests | Se usan certificados de prueba', () => {
  const privateCert = fs.readFileSync(resolve('testCerts/privateTestCert.pem'));
  const publicCert = fs.readFileSync(resolve('testCerts/publicTestCert.pem'));

  describe('Verificar que el objeto es aceptado por SOAP', () => {
    it('Debería crear el objeto de seguridad correctamente', (done) => {
      tbkSecurity(privateCert, publicCert)
        .then(
          (tbkSecurityForSoap) => {
            const soapClient = soap.createClient(
              resolve('../testCerts/webpayTestCert.pem'),
              {
                ignoredNamespaces: {
                  namespaces: [],
                  override: true,
                },
              },
            );
            soapClient.setSecurity(tbkSecurityForSoap);
          },
        )
        .then(done);
    });
  });
});
