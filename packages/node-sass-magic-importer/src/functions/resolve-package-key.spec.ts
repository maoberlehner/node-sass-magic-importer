import test from 'ava';

import { resolvePackageKeyFactory } from './resolve-package-key';

test(`Should be a function.`, (t) => {
  const resolvePackageKey = resolvePackageKeyFactory();

  t.is(typeof resolvePackageKey, `function`);
});

test(`Should find the first existing key in an object from an array of keys.`, (t) => {
  const resolvePackageKey = resolvePackageKeyFactory();
  const packageJson = {
    main: `some/file.js`,
    sass: `some/file.scss`,
  };
  const packageKeys = [
    `sass`,
    `main`,
  ];
  const newPackageJson = resolvePackageKey(packageJson, packageKeys);
  const expectedResult = {
    main: `some/file.scss`,
    sass: `some/file.scss`,
  };

  t.deepEqual(newPackageJson, expectedResult);
});
