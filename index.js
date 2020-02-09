const tbkSecurityGenerator = require('./lib/wsSecurityCertTBK');
const verifySignature = require('./lib/signatureVerifier');

module.exports = {
  tbkSecurityGenerator,
  verifySignature,
};
