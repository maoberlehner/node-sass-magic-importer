import * as glob from 'glob';
import * as path from 'path';

import { resolveGlobUrlFactory } from './resolve-glob-url';

import { IGlob } from '../interfaces/IGlob';

describe(`resolveGlobUrl()`, () => {
  test(`It should be a function.`, () => {
    const resolveGlobUrl = resolveGlobUrlFactory(glob, path);

    expect(typeof resolveGlobUrl).toBe(`function`);
  });

  test(`It should only handle URLs containing glob patterns.`, () => {
    const globMock = {
      hasMagic: jest.fn().mockReturnValue(false),
      sync: jest.fn().mockReturnValue([]),
    } as any;
    const resolveGlobUrl = resolveGlobUrlFactory(
      globMock,
      path,
    );

    const result = resolveGlobUrl(`test/url`);

    expect(globMock.hasMagic).toBeCalled();
    expect(result).toEqual(null);
  });

  test(`It should return found glob file paths.`, () => {
    const globMock = {
      hasMagic: jest.fn().mockReturnValue(true),
      sync: jest.fn().mockReturnValue([`path/1.scss`, `path/2.scss`]),
    } as any;
    const resolveGlobUrl = resolveGlobUrlFactory(
      globMock,
      path,
    );

    const result = resolveGlobUrl(`test/url/**/*.scss`, [`/test/include/path`]);

    if (/^win/.test(process.platform)) {
      expect(result).toEqual([`C:/test/include/path/path/1.scss`, `C:/test/include/path/path/2.scss`]);
    } else {
      expect(result).toEqual([`/test/include/path/path/1.scss`, `/test/include/path/path/2.scss`]);
    }
  });
});
