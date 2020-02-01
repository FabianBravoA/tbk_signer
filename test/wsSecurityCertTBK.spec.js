import fs from 'fs';
import { resolve } from 'path';
import { createClient } from 'soap';
import { tbkSecurityGenerator } from '../index';

jest.setTimeout(10000);

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
  });

  describe('Comprobar que permite enviar un mensaje SOAP usando el objeto de seguridad generado', () => {
    it('Debería poder iniciar comunicación de prueba mediante SOAP - Simulación initTransaction', (done) => {
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

                const testInput = {
                  wsInitTransactionInput: {
                    wSTransactionType: 'TR_NORMAL_WS',
                    buyOrder: 'testOrder',
                    sessionId: 1,
                    returnURL: 'http://aTestUrl.com',
                    finalURL: 'http://aFinalTestUrl.com',
                    transactionDetails: {
                      amount: 1000,
                      commerceCode: 597020000541,
                      buyOrder: 1,
                    },
                  },
                };

                client.WSWebpayServiceImplService.WSWebpayServiceImplPort.initTransaction(
                  testInput,
                  (error, result, raw) => {
                    expect(error).toBe(null);
                    expect(result).toBeDefined();
                    expect(raw).toBeDefined();
                    done();
                  },
                );
              },
            );
          },
        );
    });
  });
});

describe('TBK Verifier tests | Se verifican mensajes SOAP con certificado de prueba', () => {

});
