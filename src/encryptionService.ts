// from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  let bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[ i ]);
  }
  return window.btoa(binary);
}

export type EncryptionService = {
  encrypt: (publicKey: CryptoKey, msg: string) => Promise<ArrayBuffer>;
  importPublicKey: (publicKey: string) => Promise<CryptoKey>;
  prepareForTransport: (data: ArrayBuffer) => string;
};

function getCrypto() {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Missing crypto feature');
  }
  return window.crypto.subtle;
}

function encodeMessage(msg: string) {
  return new TextEncoder().encode(msg);
}

export const encryptionService: EncryptionService = {
  encrypt: async (publicKey: CryptoKey, data: string) => {
    const encoded = encodeMessage(data);
    return getCrypto().encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      encoded,
    );
  },
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#SubjectPublicKeyInfo_import
   */
  importPublicKey: async (key: string) => {
    // fetch the part of the PEM string between header and footer
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const pemContents = key.replace(pemHeader, '').replace(pemFooter, '');

    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);

    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return getCrypto().importKey(
      'spki',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      false,
      ['encrypt']
    );
  },
  prepareForTransport: (buffer: ArrayBuffer) => {
    return arrayBufferToBase64(buffer);
  }
};
