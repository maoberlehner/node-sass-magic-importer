import test from 'ava';
import sinon from 'sinon';

import { getAbsoluteUrl } from '../../js/lib/get-absolute-url';

test(`Should be a function.`, (t) => {
  t.is(typeof getAbsoluteUrl, `function`);
});

test(`Should call path.parse() with url.`, (t) => {
  const path = {
    parse: sinon.stub().returns({}),
    resolve() {},
  };
  const getSassFileGlobPattern = () => {};
  const url = `some/url`;

  getAbsoluteUrl({ path, getSassFileGlobPattern }, url);
  t.true(path.parse.calledWith(url));
});

test(`Should call getSassFileGlobPattern() with the parsed file base.`, (t) => {
  const base = `test-file`;
  const path = {
    parse: sinon.stub().returns({ base }),
    resolve() {},
  };
  const getSassFileGlobPattern = sinon.spy();

  getAbsoluteUrl({ path, getSassFileGlobPattern });
  t.true(getSassFileGlobPattern.calledWith(base));
});

test(`Should call path.resolve() with include path dir and a glob pattern base.`, (t) => {
  const dir = `test/dir`;
  const base = `test-file`;
  const includePath = `include/path`;
  const path = {
    parse: sinon.stub().returns({ dir, base }),
    resolve: sinon.spy(),
  };
  const getSassFileGlobPattern = sinon.stub().returns(`glob-pattern`);

  getAbsoluteUrl({ path, getSassFileGlobPattern }, undefined, [includePath]);
  t.true(path.resolve.calledWith(includePath, dir, `glob-pattern`));
});
