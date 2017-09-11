import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import { exec } from 'child_process';

import selectorImporter from '../packages/node-sass-selector-importer/dist/index';

test(`Should import only specific selectors and replace them.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/selector-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/selector-import.scss`,
    importer: selectorImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import only specific selectors and replace them via CLI.`, async (t) => {
  const cmd = `node node_modules/.bin/node-sass --importer packages/node-sass-selector-importer/dist/cli.js test/files/selector-import.scss`;
  const expectedResult = fs.readFileSync(`test/files/selector-import.css`, {
    encoding: `utf8`,
  });

  const result = new Promise((resolve) => {
    exec(cmd, (error, stdout) => {
      if (error) throw error;
      resolve(stdout);
    });
  });

  t.is(await result, expectedResult);
});
