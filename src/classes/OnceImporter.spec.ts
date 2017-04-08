import test from 'ava';
import * as sinon from 'sinon';

import resolveUrl from '../functions/resolve-url';

import { IDependencies, OnceImporter } from './OnceImporter';

test.beforeEach((t) => {
  t.context.dependencies = {
    resolveUrl,
  } as IDependencies;
});

test(`Should be an object.`, (t) => {
  const onceImporter = new OnceImporter(t.context.dependencies);
  t.is(typeof onceImporter, `object`);
});

test(`Should resolve the absolute URL.`, (t) => {
  const url = `test/url`;

  const resolveUrlSpy = sinon.spy();
  const dependenciesStub = {
    resolveUrl: resolveUrlSpy,
  };
  const dependencies = Object.assign(
    t.context.dependencies,
    dependenciesStub,
  );
  const onceImporter = new OnceImporter(dependencies);

  onceImporter.import(url, []);

  t.true(resolveUrlSpy.calledWith(url, []));
});

test(`Should return an import object (empty, if the URL was already imported).`, (t) => {
  const url = `test/url`;

  const resolveUrlSpy = sinon.spy();
  const onceImporter = new OnceImporter(t.context.dependencies);

  const firstReturnValue = onceImporter.import(url, []);
  const secondReturnValue = onceImporter.import(url, []);

  t.deepEqual(firstReturnValue, { file: url });
  t.deepEqual(secondReturnValue, { file: ``, contents: `` });
});
