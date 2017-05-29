import test from 'ava';
import * as path from 'path';

import { sassGlobPatternFactory } from './sass-glob-pattern';

test(`Should be a function.`, (t) => {
  const sassGlobPattern = sassGlobPatternFactory(path);

  t.is(typeof sassGlobPattern, `function`);
});

test(`Should return unmodified base URL if URL with extension is given.`, (t) => {
  const sassGlobPattern = sassGlobPatternFactory(path);
  const url = sassGlobPattern(`base-with.extension`);

  t.is(url, `base-with.extension`);
});

test(`Should return glob pattern from clean base URL.`, (t) => {
  const sassGlobPattern = sassGlobPatternFactory(path);
  const url = sassGlobPattern(`clean-base`);

  t.is(url, `?(_)clean-base@(.css|.sass|.scss)`);
});
