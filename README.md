# Módulo de seguridad, firma y verificación de SOAP para Transbank

[![https://nodei.co/npm/tbk_signer.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/tbk_signer.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/tbk_signer)

[![Build Status](https://travis-ci.com/FabianBravoA/tbk_signer.png?branch=master)](https://travis-ci.com/FabianBravoA/tbk_signer)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/FabianBravoA/tbk_signer/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/fabianbravoa/tbk_signer/badge.svg)](https://snyk.io/test/github/fabianbravoa/tbk_signer)

Este módulo está pensado para usarse en conjunto con la biblioteca 
[Node SOAP](https://github.com/vpulim/node-soap). Su función principal es
retornar el objeto que se debe colocar en la función ``` setSecurity ``` al
construir la instancia de SOAP que se usará para enviar todas las transacciones
del sistema Transbank.

## Antes de usar

La versión de node con que se ha probado esta biblioteca es la 12, actualmente
definida como LTS. Eso no significa que no sea compatible con las futuras
versiones, pero hay que tener esto en cuenta en caso de que aparezca un error.

Por otra parte recuerda que debes obtener tus propios certificados mediante
Transbank para ser usados junto a esta biblioteca. Los archivos que encuentres
acá son solo de prueba y por ningún motivo permitirán que puedas realizar
transacciones válidas al sistema de pagos.

Es recomendado que uses la API oficial listada en Transbank, pero en caso de que
necesites una implementación especial puedes usar este módulo para crearla.

## Instalación

```
npm i --save tbk_signer
```

## Uso

### Obtención de objeto de seguridad para Node-SOAP

````javascript
import { tbkSecurityGenerator } from 'tbk_signer';

/*
 * privateCert es un string que contiene el certificado privado en formato PEM
 * publicCert es un string que contiene el certificado público en formato PEM
 */
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
                client.setSecurity(tbkSecurityForSoap);

                /*
                 * Desde este punto en adelante el cliente está listo para hacer
                 * una transacción.
                 */
              },
            );
          },
        )
````

### Verificación de respuesta de Transbank usando certificado PEM
````javascript
import{ verifySignature } from 'tbk_signer';

client.WSWebpayServiceImplService.WSWebpayServiceImplPort.initTransaction(
  testInput,
  (error, result, raw) => {
    /*
     * WebpayCert es la ruta al archivo que contiene la firma de verificación en
     * formato PEM
     */
    if(verifySignature(webpayCert, raw)){
      /*
       * Mensaje verificado, todo OK para continuar con la transacción
       */
    } else {
      /*
       * Mensaje falla la verificación, posible ataque o mensaje sospechoso
       */
    }
    
  },
);
````

## Test

```
npm test
```

Se usa __Jest__ para testear este módulo, además de que se prueba antes el
formato del código con __eslint__. No se aceptará ningún *pull request* que no
pase ambas etapas del testeo.

## Cómo contribuir

Todas las contribuciones son bienvenidas, es recomendable eso si que primero
escribas un *issue* explicando la mejora o problema. Luego crea el
*pull request* en base a ese *issue*.

También, si es que quieres aportar un café porque te ha gustado este
repositorio, puedes hacerlo a través de ko-fi:

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y11E2KP)

## Licencia

BSD 3-Clause License

Copyright (c) 2020, Fabian Alexis Bravo Abarca
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
