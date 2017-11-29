import { resolvePackageKeyFactory } from './resolve-package-key';

describe(`resolvePackageKey()`, () => {
  test(`It should be a function.`, () => {
    const resolvePackageKey = resolvePackageKeyFactory();

    expect(typeof resolvePackageKey).toBe(`function`);
  });

  test(`It should find the first existing key in an object from an array of keys.`, () => {
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

    expect(newPackageJson).toEqual(expectedResult);
  });

  test(`It should return the original package.json if no key is found.`, () => {
    const resolvePackageKey = resolvePackageKeyFactory();
    const packageJson = {
      foo: `some/file.js`,
      bar: `some/file.scss`,
    };
    const packageKeys = [
      `sass`,
      `main`,
    ];
    const newPackageJson = resolvePackageKey(packageJson, packageKeys);

    expect(newPackageJson).toBe(packageJson);
  });
});
