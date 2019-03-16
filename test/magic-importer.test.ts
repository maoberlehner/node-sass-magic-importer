import * as fs from 'fs';
import * as sass from 'node-sass';

import { exec } from 'child_process';

import * as magicImporter from '../packages/node-sass-magic-importer/dist/index';

describe(`magicImporter()`, () => {
  test(`It should import only specific nodes.`, () => {
    const expectedResult = fs.readFileSync(`test/files/filter-import.css`, {
      encoding: `utf8`,
    });

    const result = sass.renderSync({
      file: `test/files/filter-import.scss`,
      importer: magicImporter() as any,
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import only specific custom nodes.`, () => {
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
      importer: magicImporter(options) as any,
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import glob files.`, () => {
    const expectedResult = fs.readFileSync(`test/files/glob-import.css`, {
      encoding: `utf8`,
    });

    const result = sass.renderSync({
      file: `test/files/glob-import.scss`,
      importer: magicImporter() as any,
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import glob files with filters and in packages.`, () => {
    const expectedResult = fs.readFileSync(`test/files/glob-combined-import.css`, {
      encoding: `utf8`,
    });

    const result = sass.renderSync({
      file: `test/files/glob-combined-import.scss`,
      importer: magicImporter({
        cwd: `${__dirname}/files`,
      }) as any,
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import files only once.`, () => {
    const expectedResult = fs.readFileSync(`test/files/once-import.css`, {
      encoding: `utf8`,
    });

    const result = sass.renderSync({
      file: `test/files/once-import.scss`,
      importer: magicImporter() as any,
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import the modules main file.`, () => {
    const expectedResult = fs.readFileSync(`test/files/package-import.css`, {
      encoding: `utf8`,
    });
    const result = sass.renderSync({
      file: `test/files/package-import.scss`,
      importer: magicImporter({
        cwd: `${__dirname}/files`,
      }) as any,
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import the module files with filters.`, () => {
    const expectedResult = fs.readFileSync(`test/files/package-combined-import.css`, {
      encoding: `utf8`,
    });
    const result = sass.renderSync({
      file: `test/files/package-combined-import.scss`,
      importer: magicImporter() as any,
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import only specific selectors and replace them.`, () => {
    const expectedResult = fs.readFileSync(`test/files/selector-import.css`, {
      encoding: `utf8`,
    });

    const result = sass.renderSync({
      file: `test/files/selector-import.scss`,
      importer: magicImporter() as any,
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should convert a Sass file to CSS via CLI.`, async () => {
    // tslint:disable-next-line max-line-length
    const cmd = `node node_modules/.bin/node-sass --importer packages/node-sass-magic-importer/dist/cli.js test/files/filter-import.scss`;
    const expectedResult = fs.readFileSync(`test/files/filter-import.css`, {
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
