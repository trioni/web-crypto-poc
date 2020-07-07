#!/bin/bash
DATA_FILE=encryptedData.txt
base64 -D $DATA_FILE | openssl pkeyutl -decrypt -inkey private.pem -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
