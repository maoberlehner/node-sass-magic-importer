import test from 'ava';
import * as glob from 'glob';
import * as path from 'path';
import * as sinon from 'sinon';

import sassGlobPattern from './sass-glob-pattern';

import { IDependencies, resolveUrlFactory } from './resolve-url';

test.beforeEach((t) => {
  t.context.dependencies = {
    glob,
    path,
    sassGlobPattern,
  } as IDependencies;
});

test(`Should be a function.`, (t) => {
  const resolveUrl = resolveUrlFactory(t.context.dependencies);

  t.is(typeof resolveUrl, `function`);
});

test(`Should call glob.sync() with resolved include path.`, (t) => {
  const globStub = { sync: sinon.stub().returns([]) };
  const sassGlobPatternStub = sinon.stub().returns(`some/string`);
  const dependenciesStub = {
    glob: globStub,
    sassGlobPattern: sassGlobPatternStub,
  };
  const dependencies = Object.assign(
    t.context.dependencies,
    dependenciesStub,
  );
  const resolveUrl = resolveUrlFactory(dependencies);

  resolveUrl(`test/url`, [`test/include/path`]);

  t.true(sassGlobPatternStub.calledWith(`url`));
  t.true(globStub.sync.called);
});

test(`Should return the given URL if no absolute URL can be resolved.`, (t) => {
  const url = `test/url`;

  const sassGlobPatternStub = sinon.stub().returns(`some/string`);
  const dependenciesStub = {
    sassGlobPattern: sassGlobPatternStub,
  };
  const dependencies = Object.assign(
    t.context.dependencies,
    dependenciesStub,
  );
  const resolveUrl = resolveUrlFactory(dependencies);
  const resolvedUrl = resolveUrl(url, [`test/include/path`]);

  t.is(resolvedUrl, url);
});

test(`Should return the absolute URL to a file.`, (t) => {
  const url = `files/combined.scss`;
  const includePath = `/`;
  const absoluteUrl = path.resolve(includePath, url);

  const globStub = { sync: sinon.stub().returns([absoluteUrl]) };
  const sassGlobPatternStub = sinon.stub().returns(`combined.scss`);
  const dependenciesStub = {
    glob: globStub,
    sassGlobPattern: sassGlobPatternStub,
  };
  const dependencies = Object.assign(
    t.context.dependencies,
    dependenciesStub,
  );
  const resolveUrl = resolveUrlFactory(dependencies);
  const resolvedUrl = resolveUrl(url, [includePath]);

  t.is(resolvedUrl, absoluteUrl);
});
