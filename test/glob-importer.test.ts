import * as fs from 'fs';
import * as sass from 'node-sass';

import { exec } from 'child_process';

import * as globImporter from '../packages/node-sass-glob-importer/dist/index';

describe(`globImporter()`, () => {
  test(`It should import glob files.`, () => {
    const expectedResult = fs.readFileSync(`test/files/glob-import.css`, {
      encoding: `utf8`,
    });

    const result = sass.renderSync({
      file: `test/files/glob-import.scss`,
      importer: globImporter(),
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import glob files via CLI.`, async () => {
    // tslint:disable-next-line max-line-length
    const cmd = `node node_modules/.bin/node-sass --importer packages/node-sass-glob-importer/dist/cli.js test/files/glob-import.scss`;
    const expectedResult = fs.readFileSync(`test/files/glob-import.css`, {
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
