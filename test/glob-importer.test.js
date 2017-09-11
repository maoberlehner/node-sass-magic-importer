import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import { exec } from 'child_process';

import globImporter from '../packages/node-sass-glob-importer/dist/index';

test(`Should import glob files.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/glob-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/glob-import.scss`,
    importer: globImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import glob files via CLI.`, async (t) => {
  const cmd = `node node_modules/.bin/node-sass --importer packages/node-sass-glob-importer/dist/cli.js test/files/glob-import.scss`;
  const expectedResult = fs.readFileSync(`test/files/glob-import.css`, {
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
