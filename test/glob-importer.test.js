import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

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
