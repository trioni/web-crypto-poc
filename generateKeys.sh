#!/bin/bash
openssl genrsa -des3 -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem

# Copy the public key to the public folder so that the client app can fetch it
cp public.pem public/public.pem
