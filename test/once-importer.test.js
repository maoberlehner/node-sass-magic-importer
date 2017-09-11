import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import { exec } from 'child_process';

import onceImporter from '../packages/node-sass-once-importer/dist/index';

test(`Should import files only once.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/once-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/once-import.scss`,
    importer: onceImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import files only once via CLI.`, async (t) => {
  const cmd = `node node_modules/.bin/node-sass --importer packages/node-sass-once-importer/dist/cli.js test/files/once-import.scss`;
  const expectedResult = fs.readFileSync(`test/files/once-import.css`, {
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
