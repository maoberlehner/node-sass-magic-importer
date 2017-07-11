import test from 'ava';
import * as glob from 'glob';
import * as path from 'path';
import * as sinon from 'sinon';

import { resolveUrlFactory } from './resolve-url';
import { sassGlobPatternFactory } from './sass-glob-pattern';

import { IGlob } from '../interfaces/IGlob';

test.beforeEach((t) => {
  const sassGlobPattern = sassGlobPatternFactory(path);

  t.context.dep = {
    sassGlobPattern,
  };
});

test(`Should be a function.`, (t) => {
  const resolveUrl = resolveUrlFactory(
    glob,
    path,
    t.context.dep.sassGlobPattern,
  );

  t.is(typeof resolveUrl, `function`);
});

test(`Should call glob.sync() with resolved include path.`, (t) => {
  const globStub = { sync: sinon.stub().returns([]) } as any;
  const sassGlobPatternStub = sinon.stub(t.context.dep, `sassGlobPattern`).returns(`some/string`);
  const resolveUrl = resolveUrlFactory(
    globStub,
    path,
    sassGlobPatternStub,
  );

  resolveUrl(`test/url`, [`test/include/path`]);

  t.true(sassGlobPatternStub.calledWith(`url`));
  t.true(globStub.sync.called);
});

test(`Should return the given URL if no absolute URL can be resolved.`, (t) => {
  const url = `test/url`;

  const sassGlobPatternStub = sinon.stub(t.context.dep, `sassGlobPattern`).returns(`some/string`);
  const resolveUrl = resolveUrlFactory(
    glob,
    path,
    sassGlobPatternStub,
  );
  const resolvedUrl = resolveUrl(url, [`test/include/path`]);

  t.is(resolvedUrl, url);
});

test(`Should return the absolute URL to a file.`, (t) => {
  const url = `files/combined.scss`;
  const includePath = `/`;
  const absoluteUrl = path.resolve(includePath, url);

  const globStub = { sync: sinon.stub().returns([absoluteUrl]) } as any;
  const sassGlobPatternStub = sinon.stub(t.context.dep, `sassGlobPattern`).returns(`combined.scss`);
  const resolveUrl = resolveUrlFactory(
    globStub,
    path,
    sassGlobPatternStub,
  );
  const resolvedUrl = resolveUrl(url, [includePath]);

  t.is(resolvedUrl, absoluteUrl);
});
