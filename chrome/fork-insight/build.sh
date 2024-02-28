#!/bin/bash
npm install
NODE_OPTIONS=--openssl-legacy-provider npm run build
rm -rf ../build
cp -r build ../chrome-extension
