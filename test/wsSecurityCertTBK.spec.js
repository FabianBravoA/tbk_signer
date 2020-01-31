import fs from 'fs';
import { resolve } from 'path';
import { createClient } from 'soap';
import { tbkSecurityGenerator } from '../index';


describe('TBK Signer tests | Se usan certificados de prueba', () => {
  const privateCert = fs.readFileSync(resolve('testCerts/privateTestCert.pem'), { encoding: 'utf-8' });
  const publicCert = fs.readFileSync(resolve('testCerts/publicTestCert.pem'), { encoding: 'utf-8' });

  describe('Verificar que el objeto es aceptado por SOAP', () => {
    it('Debería crear el objeto de seguridad correctamente', (done) => {
      tbkSecurityGenerator(privateCert, publicCert)
        .then(
          (tbkSecurityForSoap) => {
            createClient(
              'https://webpay3gint.transbank.cl/WSWebpayTransaction/cxf/WSWebpayService?wsdl',
              {
                ignoredNamespaces: {
                  namespaces: [],
                  override: true,
                },
              },
              (soapError, client) => {
                expect(soapError).toBe(null);
                client.setSecurity(tbkSecurityForSoap);
              },
            );
          },
        )
        .then(done);
    });

    it('Debería poder iniciar comunicación de prueba mediante SOAP', () => {

    });
  });
});
