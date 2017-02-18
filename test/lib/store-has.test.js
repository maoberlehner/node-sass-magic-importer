import test from 'ava';
import sinon from 'sinon';

import { storeHasFactory } from '../../js/lib/store-has';

test(`Should be a function.`, (t) => {
  const storeHas = storeHasFactory();
  t.is(typeof storeHas, `function`);
});

test(`Should return true if store has URL and the URL has no filters.`, (t) => {
  const url = `some/url`;
  const storeHas = storeHasFactory({ store: [url] });

  t.true(storeHas(url));
});

test(`Should return false if an URL is imported for the first time.`, (t) => {
  const storeHas = storeHasFactory({ store: [] });

  t.false(storeHas(`some/url`));
});

test(`Should call console.warn() and return false if an URL is imported twice and has filters.`, (t) => {
  const url = `some/url`;
  const store = [url];
  const console = { warn: sinon.spy() };
  const storeHas = storeHasFactory({ store, console });

  t.false(storeHas(url, true));
  t.true(console.warn.called);
});
