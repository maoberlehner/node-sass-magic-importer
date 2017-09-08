import test from 'ava';
import * as glob from 'glob';
import * as path from 'path';
import * as sinon from 'sinon';

import { resolveGlobUrlFactory } from './resolve-glob-url';

import { IGlob } from '../interfaces/IGlob';

test(`Should be a function.`, (t) => {
  const resolveGlobUrl = resolveGlobUrlFactory(glob, path);

  t.is(typeof resolveGlobUrl, `function`);
});

test(`Should only handle URLs containing glob patterns.`, (t) => {
  const globStub = {
    hasMagic: sinon.stub().returns(false),
    sync: sinon.stub().returns([]),
  } as any;
  const resolveGlobUrl = resolveGlobUrlFactory(
    globStub,
    path,
  );

  const result = resolveGlobUrl(`test/url`, [`/test/include/path`]);

  t.true(globStub.hasMagic.called);
  t.deepEqual(result, []);
});

test(`Should return found glob file paths.`, (t) => {
  const globStub = {
    hasMagic: sinon.stub().returns(true),
    sync: sinon.stub().returns([`path/1.scss`, `path/2.scss`]),
  } as any;
  const resolveGlobUrl = resolveGlobUrlFactory(
    globStub,
    path,
  );

  const result = resolveGlobUrl(`test/url/**/*.scss`, [`/test/include/path`]);

  if (/^win/.test(process.platform)) {
    t.deepEqual(result, [`C:/test/include/path/path/1.scss`, `C:/test/include/path/path/2.scss`]);
  } else {
    t.deepEqual(result, [`/test/include/path/path/1.scss`, `/test/include/path/path/2.scss`]);
  }
});
