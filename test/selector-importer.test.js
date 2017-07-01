import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import selectorImporter from '../packages/node-sass-magic-importer/dist/selector-importer';

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
