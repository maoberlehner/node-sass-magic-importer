import test from 'ava';
import sinon from 'sinon';
import nodePath from 'path';

import { getAbsoluteUrl } from '../../js/lib/get-absolute-url';

const includePath = `test/include/path`;
const dir = `test-dir`;
const base = `test-base`;
const globPattern = `test-glob-pattern`;

const path = {
  parse: sinon.stub().returns({ dir, base }),
  resolve: sinon.stub().returns(nodePath.resolve(includePath, dir, globPattern)),
};
const getSassFileGlobPattern = sinon.stub().returns(globPattern);
const glob = { sync: sinon.spy() };

// test(`Should be a function.`, (t) => {
//   t.is(typeof getAbsoluteUrl, `function`);
// });

// // Should return absolute path immediately.

// test(`Should call path.parse() with url.`, (t) => {
//   const path = {
//     parse: sinon.stub().returns({}),
//     resolve() {},
//   };
//   const getSassFileGlobPattern = () => {};
//   const url = `some/url`;

//   getAbsoluteUrl({ path, getSassFileGlobPattern }, url);
//   t.true(path.parse.calledWith(url));
// });

// test(`Should call getSassFileGlobPattern() with the parsed file base.`, (t) => {
//   const base = `test-file`;
//   const path = {
//     parse: sinon.stub().returns({ base }),
//     resolve() {},
//   };
//   const getSassFileGlobPattern = sinon.spy();

//   getAbsoluteUrl({ path, getSassFileGlobPattern });
//   t.true(getSassFileGlobPattern.calledWith(base));
// });

// test(`Should call path.resolve() with include path dir and a glob pattern base.`, (t) => {
//   const dir = `test/dir`;
//   const base = `test-file`;
//   const globPattern = `glob-pattern`;
//   const includePath = `include/path`;
//   const path = {
//     parse: sinon.stub().returns({ dir, base }),
//     resolve: sinon.spy(),
//   };
//   const getSassFileGlobPattern = sinon.stub().returns(globPattern);

//   getAbsoluteUrl({ path, getSassFileGlobPattern }, undefined, [includePath]);
//   t.true(path.resolve.calledWith(includePath, dir, globPattern));
// });

test.only(`Should call glob.sync() with resolved include path.`, (t) => {
  const resolvedPath = nodePath.resolve(includePath, dir, globPattern);

  getAbsoluteUrl({ path, getSassFileGlobPattern, glob });
  t.true(glob.sync.calledWith(resolvedPath));
});

// Should return false if no absolute url can be resolved.
// Should return absolute url.
