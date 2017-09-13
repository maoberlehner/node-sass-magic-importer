import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import { exec } from 'child_process';

import filterImporter from '../packages/node-sass-filter-importer/dist/index';

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

test(`Should import only specific custom nodes.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/filter-import-custom.css`, {
    encoding: `utf8`,
  });
  const options = {
    customFilters: {
      customMediaWidth: [
        [
          { property: `type`, value: `atrule` },
          { property: `name`, value: `media` },
          { property: `params`, value: `(min-width: 42em)` },
        ],
      ],
      customMediaPrint: [
        [
          { property: `type`, value: `atrule` },
          { property: `name`, value: `media` },
          { property: `params`, value: `print` },
        ],
      ],
    },
  };

  const result = sass.renderSync({
    file: `test/files/filter-import-custom.scss`,
    importer: filterImporter(options),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import only specific nodes via CLI.`, async (t) => {
  const cmd = `node node_modules/.bin/node-sass --importer packages/node-sass-filter-importer/dist/cli.js test/files/filter-import.scss`;
  const expectedResult = fs.readFileSync(`test/files/filter-import.css`, {
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
