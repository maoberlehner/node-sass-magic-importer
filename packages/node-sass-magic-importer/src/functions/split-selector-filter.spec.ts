import test from 'ava';

import { splitSelectorFilterFactory } from './split-selector-filter';

test(`Should be a function.`, (t) => {
  const splitSelectorFilter = splitSelectorFilterFactory();

  t.is(typeof splitSelectorFilter, `function`);
});

test(`Should split selector filters and trim parts.`, (t) => {
  const splitSelectorFilter = splitSelectorFilterFactory();
  const splittedSelectorFilter = splitSelectorFilter(`.some-selector  as .some-replacement `);

  t.deepEqual(splittedSelectorFilter, {
    selector: `.some-selector`,
    replacement: `.some-replacement`,
  });
});
