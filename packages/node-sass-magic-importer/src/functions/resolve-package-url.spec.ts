import * as path from 'path';

import { resolvePackageUrlFactory } from './resolve-package-url';
import { sassUrlVariantsFactory } from './sass-url-variants';

const sassUrlVariants = sassUrlVariantsFactory(path);

let dependencies: any;

describe(`resolvePackageUrl()`, () => {
  beforeEach(() => {
    dependencies = {
      sassUrlVariants,
    };
  });

  test(`It should be a function.`, () => {
    const resolveMock = { sync: jest.fn().mockReturnValue(`resolved/path.scss`) } as any;
    const resolvePackageKeysMock = jest.fn().mockReturnValue({ main: `some/file.scss` });
    const resolvePackageUrl = resolvePackageUrlFactory(
      resolveMock,
      resolvePackageKeysMock,
      dependencies.sassUrlVariants,
    );

    expect(typeof resolvePackageUrl).toBe(`function`);
  });

  test(`It should resolve the path to a file in the node_modules directory.`, () => {
    const url = `some/file.scss`;
    const extensions = [`.scss`];
    const cwd = `/`;
    const packageKeys = [`main`];

    const resolveMock = { sync: jest.fn().mockReturnValue(`resolved/path.scss`) } as any;
    const resolvePackageKeysMock = jest.fn().mockReturnValue({ main: `some/file.scss` });
    const sassUrlVariantsMock = jest.fn().mockReturnValue([
      `some/url/variant.scss`,
    ]);
    const resolvePackageUrl = resolvePackageUrlFactory(
      resolveMock,
      resolvePackageKeysMock,
      sassUrlVariantsMock,
    );

    const file = resolvePackageUrl(url, extensions, cwd, packageKeys);

    expect(sassUrlVariantsMock).toBeCalledWith(url, extensions);
    expect(resolveMock.sync.mock.calls[0][0]).toBe(`some/url/variant.scss`);
    expect(file).toBe(`resolved/path.scss`);
  });
});
