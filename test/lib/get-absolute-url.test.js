import test from 'ava';
import sinon from 'sinon';

import { getAbsoluteUrl } from '../../js/lib/get-absolute-url';

test(`Should be a function.`, (t) => {
  t.is(typeof getAbsoluteUrl, `function`);
});

test(`Should call path.parse() with url.`, (t) => {
  const path = { parse: sinon.spy() };
  const url = `some/url`;

  getAbsoluteUrl({ path }, url);
  t.true(path.parse.calledWith(url));
});
