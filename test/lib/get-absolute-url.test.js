import test from 'ava';
import sinon from 'sinon';

import { getAbsoluteUrl } from '../../js/lib/get-absolute-url';

test(`Should be a function.`, (t) => {
  t.is(typeof getAbsoluteUrl, `function`);
});

test(`Should call path.parse() with url.`, (t) => {
  const path = { parse: sinon.stub().returns({}) };
  const getSassFileGlobPattern = () => {};
  const url = `some/url`;

  getAbsoluteUrl({ path, getSassFileGlobPattern }, url);
  t.true(path.parse.calledWith(url));
});

test(`Should call getSassFileGlobPattern() with the parsed file base.`, (t) => {
  const base = `test-file`;
  const path = { parse: sinon.stub().returns({ base }) };
  const getSassFileGlobPattern = sinon.spy();

  getAbsoluteUrl({ path, getSassFileGlobPattern });
  t.true(getSassFileGlobPattern.calledWith(base));
});
