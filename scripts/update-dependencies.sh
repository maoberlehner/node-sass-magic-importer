#!/bin/bash

rm -Rf package-lock.json

node_modules/.bin/npm-check-updates -u

npm install

for package in packages/*; do
  ( cd $package && ../../node_modules/.bin/npm-check-updates -u )
done

npm run bootstrap
