#!/bin/bash
npm install
CI=false NODE_OPTIONS=--openssl-legacy-provider npm run build
rm -rf ../build
cp -r build ../chrome-extension
