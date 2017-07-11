import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

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
