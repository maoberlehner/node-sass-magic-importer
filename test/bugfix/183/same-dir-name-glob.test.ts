import * as fs from 'fs';
import * as sass from 'node-sass';

import * as magicImporter from '../../../packages/node-sass-magic-importer/dist/index';

describe(`magicImporter()`, () => {
  test(`It should correctly resolve glob pattern.`, () => {
    const expectedResult = fs.readFileSync(`test/bugfix/183/files/main.css`, {
      encoding: `utf8`,
    });
    const result = sass.renderSync({
      file: `test/bugfix/183/files/main.scss`,
      importer: magicImporter({
        cwd: `${__dirname}/files`,
      }),
      // This is important for the test case!
      // includePaths: [`${__dirname}/files`],
    }).css.toString();

    expect(result).toBe(expectedResult);
  });
});
