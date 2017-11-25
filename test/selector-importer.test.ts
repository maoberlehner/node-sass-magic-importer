import * as fs from 'fs';
import * as sass from 'node-sass';

import { exec } from 'child_process';

import * as selectorImporter from '../packages/node-sass-selector-importer/dist/index';

describe(`selectorImporter()`, () => {
  test(`It should import only specific selectors and replace them.`, () => {
    const expectedResult = fs.readFileSync(`test/files/selector-import.css`, {
      encoding: `utf8`,
    });

    const result = sass.renderSync({
      file: `test/files/selector-import.scss`,
      importer: selectorImporter(),
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import only specific selectors and replace them via CLI.`, async () => {
    // tslint:disable-next-line max-line-length
    const cmd = `node node_modules/.bin/node-sass --importer packages/node-sass-selector-importer/dist/cli.js test/files/selector-import.scss`;
    const expectedResult = fs.readFileSync(`test/files/selector-import.css`, {
      encoding: `utf8`,
    });

    const result = await new Promise((resolve) => {
      exec(cmd, (error, stdout) => {
        if (error) {
          throw error;
        }
        resolve(stdout);
      });
    });

    expect(result).toBe(expectedResult);
  });
});
