import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import filterImporter from '../packages/node-sass-magic-importer/dist/filter-importer';

test(`Should import only specific nodes.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/filter-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/filter-import.scss`,
    importer: filterImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});
