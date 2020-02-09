const { DOMParser } = require('xmldom');
const { xpath, SignedXml, FileKeyInfo } = require('xml-crypto');

/* WebpayKey as first argument lets you wrap this function with bind and obtain
a new function that only needs an xml
 */
module.exports = (webpayKey, xml) => {
  const doc = new DOMParser().parseFromString(xml);
  const [signature] = xpath(doc, "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']");
  const sig = new SignedXml();

  // Hack to check non-standard transbank SignedInfo node
  sig.validateSignatureValue = () => {
    const signedInfo = xpath(doc, "//*[local-name(.)='SignedInfo']");
    if (signedInfo.length === 0) throw new Error('could not find SignedInfo element in the message');
    let signedInfoCanon = sig.getCanonXml([sig.canonicalizationAlgorithm], signedInfo[0]);
    signedInfoCanon = signedInfoCanon.toString().replace('xmlns:ds="http://www.w3.org/2000/09/xmldsig#"', 'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"');
    const signer = sig.findSignatureAlgorithm(sig.signatureAlgorithm);
    const res = signer.verifySignature(signedInfoCanon, sig.signingKey, sig.signatureValue);
    if (!res) sig.validationErrors.push(`invalid signature: the signature value ${sig.signatureValue} is incorrect`);
    return res;
  };

  sig.keyInfoProvider = new FileKeyInfo(webpayKey);
  sig.loadSignature(signature);
  const res = sig.checkSignature(xml);
  if (!res) {
    console.error(sig.validationErrors);
    throw new Error('No result after checking the signature, check the error logs for more information');
  }
  return res;
};
