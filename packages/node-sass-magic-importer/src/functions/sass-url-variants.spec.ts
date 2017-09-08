import test from 'ava';
import * as path from 'path';

import { sassUrlVariantsFactory } from './sass-url-variants';

test(`Should be a function.`, (t) => {
  const sassUrlVariants = sassUrlVariantsFactory(path);

  t.is(typeof sassUrlVariants, `function`);
});

test(`Should return the unmodified URL in an array if no file is specified.`, (t) => {
  const sassUrlVariants = sassUrlVariantsFactory(path);
  const urlArray = sassUrlVariants(`some-package-name`, [`.scss`, `.sass`]);

  t.deepEqual(urlArray, [`some-package-name`]);
});

test(`Should return an array of URL variants.`, (t) => {
  const sassUrlVariants = sassUrlVariantsFactory(path);
  const urlArray = sassUrlVariants(path.join(`some-package-name`, `some`, `file`), [`.scss`, `.sass`]);

  t.deepEqual(urlArray, [
    path.join(`some-package-name`, `some`, `file`),
    path.join(`some-package-name`, `some`, `file.scss`),
    path.join(`some-package-name`, `some`, `_file.scss`),
    path.join(`some-package-name`, `some`, `file.sass`),
    path.join(`some-package-name`, `some`, `_file.sass`),
  ]);
});
