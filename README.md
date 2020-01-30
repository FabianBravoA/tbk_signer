# Módulo de seguridad, firma y verificación de SOAP para Transbank

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

## Uso

## Test

## Cómo contribuir

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
