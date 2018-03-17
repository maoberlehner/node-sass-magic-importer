import * as fs from 'fs';
import * as sass from 'node-sass';

import * as magicImporter from '../../../packages/node-sass-magic-importer/dist/index';

describe(`magicImporter()`, () => {
  test(`It should start trying to resolve paths starting with the path of the parent file.`, () => {
    const expectedResult = fs.readFileSync(`test/bugfix/165/files/resolve-from-parent.css`, {
      encoding: `utf8`,
    });
    const result = sass.renderSync({
      file: `test/bugfix/165/files/resolve-from-parent.scss`,
      importer: magicImporter({
        cwd: `${__dirname}/files`,
      }),
      // This is important for the test case!
      includePaths: [`${__dirname}/files`],
    }).css.toString();

    expect(result).toBe(expectedResult);
  });
});
