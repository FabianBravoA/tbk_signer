module.exports = `
<wsse:SecurityTokenReference>
    <X509Data xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
      <X509IssuerSerial>
        <X509IssuerName><%-issuerName%></X509IssuerName>
        <X509SerialNumber><%-serialNumber%></X509SerialNumber>
      </X509IssuerSerial>
      <X509Certificate><%-cert%></X509Certificate>
    </X509Data>
</wsse:SecurityTokenReference>
`;
