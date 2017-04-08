import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import onceImporter from '../dist/once-importer';

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
