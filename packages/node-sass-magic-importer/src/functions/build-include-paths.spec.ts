import test from 'ava';
import * as path from 'path';

import { buildIncludePathsFactory } from './build-include-paths';

test(`Should be a function.`, (t) => {
  const buildIncludePaths = buildIncludePathsFactory(path);

  t.is(typeof buildIncludePaths, `function`);
});

test(`Should return an array with node-sass include paths.`, (t) => {
  const buildIncludePaths = buildIncludePathsFactory(path);

  const nodeSassIncludePaths = `/include/path1${path.delimiter}/include/path2`;
  const previouslyResolvedPath = `non-absolute/include/path/file.scss`;
  const expectedResult = [
    `/include/path1`,
    `/include/path2`,
  ];

  t.deepEqual(
    buildIncludePaths(nodeSassIncludePaths, previouslyResolvedPath),
    expectedResult,
  );
});

test(`Should return an array with node-sass include paths and include path from previous file.`, (t) => {
  const buildIncludePaths = buildIncludePathsFactory(path);

  const nodeSassIncludePaths = `/include/path1${path.delimiter}/include/path2`;
  const previouslyResolvedPath = `/include/path3/file.scss`;
  const expectedResult = [
    `/include/path1`,
    `/include/path2`,
    `/include/path3`,
  ];

  t.deepEqual(
    buildIncludePaths(nodeSassIncludePaths, previouslyResolvedPath),
    expectedResult,
  );
});
