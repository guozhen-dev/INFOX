cd ../ceclient
npm install --force
NODE_OPTIONS=--openssl-legacy-provider INLINE_RUNTIME_CHUNK=false  npm run build
cp -r build/* ../chrome-extension/
cd -
cd extension-config
python3 make.py
cd ..
cp extension-config/*.json .


