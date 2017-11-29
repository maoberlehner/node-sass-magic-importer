import * as glob from 'glob';
import * as path from 'path';

import { resolveUrlFactory } from './resolve-url';
import { sassGlobPatternFactory } from './sass-glob-pattern';

import { IGlob } from '../interfaces/IGlob';

const sassGlobPattern = sassGlobPatternFactory(path);

let dependencies: any;

describe(`resolveUrl()`, () => {
  beforeEach(() => {
    dependencies = {
      sassGlobPattern,
    };
  });

  test(`It should be a function.`, () => {
    const resolveUrl = resolveUrlFactory(
      glob,
      path,
      dependencies.sassGlobPattern,
    );

    expect(typeof resolveUrl).toBe(`function`);
  });

  test(`It should call glob.sync() with resolved include path.`, () => {
    const globMock = { sync: jest.fn().mockReturnValue([]) } as any;
    const sassGlobPatternMock = jest.fn().mockReturnValue(`some/string`);
    const resolveUrl = resolveUrlFactory(
      globMock,
      path,
      sassGlobPatternMock,
    );

    resolveUrl(`test/url`, [`test/include/path`]);

    expect(sassGlobPatternMock).toBeCalledWith(`url`);
    expect(globMock.sync).toBeCalled();
  });

  test(`It should return the given URL if no absolute URL can be resolved.`, () => {
    const url = `test/url`;

    const sassGlobPatternMock = jest.fn().mockReturnValue(`some/string`);
    const resolveUrl = resolveUrlFactory(
      glob,
      path,
      sassGlobPatternMock,
    );
    const resolvedUrl = resolveUrl(url, [`test/include/path`]);

    expect(resolvedUrl).toBe(url);
  });

  test(`It should return the absolute URL to a file.`, () => {
    const url = `files/combined.scss`;
    const includePath = `/`;
    const absoluteUrl = path.resolve(includePath, url);

    const globMock = { sync: jest.fn().mockReturnValue([absoluteUrl]) } as any;
    const sassGlobPatternMock = jest.fn().mockReturnValue(`combined.scss`);
    const resolveUrl = resolveUrlFactory(
      globMock,
      path,
      sassGlobPatternMock,
    );
    const resolvedUrl = resolveUrl(url, [includePath]);

    expect(resolvedUrl).toBe(absoluteUrl);
  });

  test(`It should return the given URL if no include path could be resolved.`, () => {
    const url = `files/combined.scss`;

    const resolveUrl = resolveUrlFactory(
      glob,
      path,
      dependencies.sassGlobPattern,
    );
    const resolvedUrl = resolveUrl(url);

    expect(resolvedUrl).toBe(url);
  });
});
