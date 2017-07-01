import test from 'ava';

import { escapeSelectorFactory } from './escape-selector';

test(`Should be a function.`, (t) => {
  const escapeSelector = escapeSelectorFactory();

  t.is(typeof escapeSelector, `function`);
});

test(`Should escape special characters.`, (t) => {
  const escapeSelector = escapeSelectorFactory();

  t.is(escapeSelector(`@/@mixin`), `\\@\\/@mixin`);
});
