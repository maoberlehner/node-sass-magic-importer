#!/bin/bash

rm -Rf package-lock.json

node_modules/.bin/npm-check-updates -u --reject bootstrap

npm install

for package in packages/*; do
  ( cd $package && ../../node_modules/.bin/npm-check-updates -u --reject css-node-extract,css-selector-extract )
done

npm run bootstrap
