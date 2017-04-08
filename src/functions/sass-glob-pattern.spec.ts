import test from 'ava';
import * as path from 'path';

import { IDependencies, sassGlobPatternFactory } from './sass-glob-pattern';

test.beforeEach((t) => {
  t.context.dependencies = { path } as IDependencies;
});

test(`Should be a function.`, (t) => {
  const sassGlobPattern = sassGlobPatternFactory(t.context.dependencies);
  t.is(typeof sassGlobPattern, `function`);
});

test(`Should return unmodified base URL if URL with extension is given.`, (t) => {
  const sassGlobPattern = sassGlobPatternFactory(t.context.dependencies);
  const url = sassGlobPattern(`base-with.extension`);

  t.is(url, `base-with.extension`);
});

test(`Should return glob pattern from clean base URL.`, (t) => {
  const sassGlobPattern = sassGlobPatternFactory(t.context.dependencies);
  const url = sassGlobPattern(`clean-base`);

  t.is(url, `?(_)clean-base@(.css|.sass|.scss)`);
});
