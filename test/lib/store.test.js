import test from 'ava';

import store from '../../js/lib/store';

test(`Should be an array.`, (t) => {
  t.true(Array.isArray(store));
});
