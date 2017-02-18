import test from 'ava';

import { storeAddFactory } from '../../js/lib/store-add';

test(`Should be a function.`, (t) => {
  const storeAdd = storeAddFactory();
  t.is(typeof storeAdd, `function`);
});

test.only(`Should add a file to the store if it is not already included.`, (t) => {
  const url = `some/url`;
  const store = [];
  const storeAdd = storeAddFactory({ store });
  storeAdd(url);

  t.deepEqual(store, [url]);
});

test.only(`Should not add a file to the store if it is already included.`, (t) => {
  const url = `some/url`;
  const store = [url];
  const storeAdd = storeAddFactory({ store });
  storeAdd(url);

  t.deepEqual(store, [url]);
});
