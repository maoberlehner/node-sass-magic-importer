import test from 'ava';

import { storeClearFactory } from '../../js/lib/store-clear';

test(`Should be a function.`, (t) => {
  const storeClear = storeClearFactory();
  t.is(typeof storeClear, `function`);
});

test(`Should reset the store to an empty array.`, (t) => {
  const store = [`array`, `with`, `values`];
  const storeClear = storeClearFactory({ store });
  storeClear();

  t.deepEqual(store, []);
});
