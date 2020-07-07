# Web crypto PoC

## Prerequisites

- openssl `brew install openssl`.
  - `openssl version` should output something like `OpenSSL 1.1.1`.
  - `Libressl` that comes preinstalled on osx cannot be used due to lacking support for SHA256.
- `./generateKeys.sh` to generate a public and private key. You'll need to use a passphrase that's at least 4 chars long.
- `npm install` or `yarn install` to install dependencies for the web app.
- `npm start` or `yarn start` --> visit [http://localhost:3000](http://localhost:3000)

## Encrypt

- Visit [http://localhost:3000](http://localhost:3000) and input your "secret"
- Submit the form by pressing "Encrypt"

## Decrypt

- Copy the contents of "Encrypted data" textarea that appears after clicking "Encrypt"
- Save the encrypted data
  - `echo "encryted-data-from-browser" > encryptedData.txt`
  - `./decrypt.sh` --> should output the same text as entered in the browser
  
  ✅🎉
