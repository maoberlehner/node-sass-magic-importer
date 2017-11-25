import * as fs from 'fs';
import * as sass from 'node-sass';

import { exec } from 'child_process';

import * as filterImporter from '../packages/node-sass-filter-importer';

describe(`filterImporter()`, () => {
  test(`It should import only specific nodes.`, () => {
    const expectedResult = fs.readFileSync(`test/files/filter-import.css`, {
      encoding: `utf8`,
    });

    const result = sass.renderSync({
      file: `test/files/filter-import.scss`,
      importer: filterImporter(),
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
      importer: filterImporter(options),
    }).css.toString();

    expect(result).toBe(expectedResult);
  });

  test(`It should import only specific nodes via CLI.`, async () => {
    // tslint:disable-next-line max-line-length
    const cmd = `node node_modules/.bin/node-sass --importer packages/node-sass-filter-importer/dist/cli.js test/files/filter-import.scss`;
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
