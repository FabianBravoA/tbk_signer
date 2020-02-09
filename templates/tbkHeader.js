module.exports = `
<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wsse:mustUnderstand="1">
  <KeyInfo>
    <X509Data>
      <X509IssuerSerial>
        <X509IssuerName><%-issuerName%></X509IssuerName>
        <X509SerialNumber><%-serialNumber%></X509SerialNumber>
      </X509IssuerSerial>
      <X509Certificate><%-cert%></X509Certificate>
    </X509Data>
  </KeyInfo>
</wsse:Security>
`;
