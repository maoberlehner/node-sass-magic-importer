import * as path from 'path';

import { sassUrlVariantsFactory } from './sass-url-variants';

describe(`sassUrlVariants()`, () => {
  test(`It should be a function.`, () => {
    const sassUrlVariants = sassUrlVariantsFactory(path);

    expect(typeof sassUrlVariants).toBe(`function`);
  });

  test(`It should return the unmodified URL in an array if no file is specified.`, () => {
    const sassUrlVariants = sassUrlVariantsFactory(path);
    const urlArray = sassUrlVariants(`some-package-name`, [`.scss`, `.sass`]);

    expect(urlArray).toEqual([`some-package-name`]);
  });

  test(`It should return the unmodified URL in an array if no extensions are specified.`, () => {
    const sassUrlVariants = sassUrlVariantsFactory(path);
    const urlArray = sassUrlVariants(path.join(`some-package-name`, `some`, `file`));

    expect(urlArray).toEqual([path.join(`some-package-name`, `some`, `file`)]);
  });

  test(`It should return an array of URL variants.`, () => {
    const sassUrlVariants = sassUrlVariantsFactory(path);
    const urlArray = sassUrlVariants(path.join(`some-package-name`, `some`, `file`), [`.scss`, `.sass`]);

    expect(urlArray).toEqual([
      path.join(`some-package-name`, `some`, `file`),
      path.join(`some-package-name`, `some`, `file.scss`),
      path.join(`some-package-name`, `some`, `_file.scss`),
      path.join(`some-package-name`, `some`, `file.sass`),
      path.join(`some-package-name`, `some`, `_file.sass`),
    ]);
  });
});
