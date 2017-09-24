#!/bin/bash

rm -Rf package-lock.json

node_modules/.bin/npm-check-updates -au

npm install

for package in packages/*; do
  ( cd $package && ../../node_modules/.bin/npm-check-updates -au )
done

npm run bootstrap
