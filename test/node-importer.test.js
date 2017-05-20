import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import nodeImporter from '../dist/node-importer';

test(`Should import only specific nodes.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/node-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/node-import.scss`,
    importer: nodeImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});
