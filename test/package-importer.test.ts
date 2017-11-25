import * as fs from 'fs';
import * as sass from 'node-sass';

import { exec } from 'child_process';

import * as packageImporter from '../packages/node-sass-package-importer/dist/index';

describe(`packageImporter()`, () => {
  test(`It should import the modules main file.`, () => {
    const expectedResult = fs.readFileSync(`test/files/package-import.css`, {
      encoding: `utf8`,
    });
    const result = sass.renderSync({
      file: `test/files/package-import.scss`,
      importer: packageImporter({
        cwd: `${__dirname}/files`,
      }),
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import the modules main file via CLI.`, async () => {
    // tslint:disable-next-line max-line-length
    const cmd = `cd ${__dirname}/files && node ../../node_modules/.bin/node-sass --importer ../../packages/node-sass-package-importer/dist/cli.js package-import.scss`;
    const expectedResult = fs.readFileSync(`test/files/package-import.css`, {
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
