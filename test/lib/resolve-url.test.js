import glob from 'glob';
import test from 'ava';
import sinon from 'sinon';
import path from 'path';

import { resolveUrlFactory } from '../../js/lib/resolve-url';

test(`Should be a function.`, (t) => {
  const resolveUrl = resolveUrlFactory();
  t.is(typeof resolveUrl, `function`);
});

test(`Should call glob.sync() with resolved include path.`, (t) => {
  const sassGlobPattern = sinon.stub().returns(`some/string`);
  const globStub = { sync: sinon.stub().returns([]) };
  const resolveUrl = resolveUrlFactory({
    path,
    sassGlobPattern,
    glob: globStub,
  });

  resolveUrl(`test/url`, [`test/include/path`]);

  t.true(sassGlobPattern.calledWith(`url`));
  t.true(globStub.sync.called);
});

test(`Should return the given URL if no absolute URL can be resolved.`, (t) => {
  const sassGlobPattern = sinon.stub().returns(`some/string`);
  const url = `test/url`;
  const resolveUrl = resolveUrlFactory({
    path,
    sassGlobPattern,
    glob,
  });

  const resolvedUrl = resolveUrl(url, [`test/include/path`]);

  t.is(resolvedUrl, url);
});

test(`Should return the absolute URL to a file.`, (t) => {
  const sassGlobPattern = sinon.stub().returns(`combined.scss`);
  const url = `files/combined.scss`;
  const includePath = path.resolve(__dirname, `../`);
  const absoluteUrl = path.resolve(includePath, url);
  const resolveUrl = resolveUrlFactory({
    path,
    sassGlobPattern,
    glob,
  });

  const resolvedUrl = resolveUrl(url, [includePath]);

  t.is(resolvedUrl, absoluteUrl);
});
