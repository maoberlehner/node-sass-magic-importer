import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import { exec } from 'child_process';

import packageImporter from '../packages/node-sass-package-importer/dist/index';

test(`Should import the modules main file.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/package-import.css`, {
    encoding: `utf8`,
  });
  const result = sass.renderSync({
    file: `test/files/package-import.scss`,
    importer: packageImporter({
      cwd: `${__dirname}/files`
    }),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import the modules main file via CLI.`, async (t) => {
  const cmd = `cd ${__dirname}/files && node ../../node_modules/.bin/node-sass --importer ../../packages/node-sass-package-importer/dist/cli.js package-import.scss`;
  const expectedResult = fs.readFileSync(`test/files/package-import.css`, {
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
