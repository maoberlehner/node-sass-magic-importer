import * as path from 'path';

import { sassGlobPatternFactory } from './sass-glob-pattern';

describe(`sassGlobPattern()`, () => {
  test(`It should be a function.`, () => {
    const sassGlobPattern = sassGlobPatternFactory(path);

    expect(typeof sassGlobPattern).toBe(`function`);
  });

  test(`It should return unmodified base URL if URL with extension is given.`, () => {
    const sassGlobPattern = sassGlobPatternFactory(path);
    const url = sassGlobPattern(`base-with.extension`);

    expect(url).toBe(`base-with.extension`);
  });

  test(`It should return glob pattern from clean base URL.`, () => {
    const sassGlobPattern = sassGlobPatternFactory(path);
    const url = sassGlobPattern(`clean-base`);

    expect(url).toBe(`?(_)clean-base@(.css|.sass|.scss)`);
  });
});
