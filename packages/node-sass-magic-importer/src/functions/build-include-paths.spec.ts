import * as path from 'path';

import { buildIncludePathsFactory } from './build-include-paths';

describe(`buildIncludePaths()`, () => {
  it(`It should be a function.`, () => {
    const buildIncludePaths = buildIncludePathsFactory(path);

    expect(typeof buildIncludePaths).toBe(`function`);
  });

  test(`It should return an array with node-sass include paths.`, () => {
    const buildIncludePaths = buildIncludePathsFactory(path);

    const nodeSassIncludePaths = `/include/path1${path.delimiter}/include/path2`;
    const previouslyResolvedPath = `non-absolute/include/path/file.scss`;
    const expectedResult = [
      `/include/path1`,
      `/include/path2`,
    ];

    expect(buildIncludePaths(nodeSassIncludePaths, previouslyResolvedPath))
      .toEqual(expectedResult);
  });

  test(`It should return an array with node-sass include paths and include path from previous file.`, () => {
    const buildIncludePaths = buildIncludePathsFactory(path);

    const nodeSassIncludePaths = `/include/include-path1${path.delimiter}/include/include-path2`;
    const previouslyResolvedPath = `/include/previously-resolved-path/file.scss`;
    const expectedResult = [
      `/include/previously-resolved-path`,
      `/include/include-path1`,
      `/include/include-path2`,
    ];

    expect(buildIncludePaths(nodeSassIncludePaths, previouslyResolvedPath))
      .toEqual(expectedResult);
  });
});
