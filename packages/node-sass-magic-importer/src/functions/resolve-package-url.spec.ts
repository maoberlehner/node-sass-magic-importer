import test from 'ava';
import * as path from 'path';
import * as sinon from 'sinon';

import { resolvePackageUrlFactory } from './resolve-package-url';
import { sassUrlVariantsFactory } from './sass-url-variants';

test.beforeEach((t) => {
  const sassUrlVariants = sassUrlVariantsFactory(path);

  t.context.dep = {
    sassUrlVariants,
  };
});

test(`Should be a function.`, (t) => {
  const resolveStub = { sync: sinon.stub().returns(`resolved/path.scss`) } as any;
  const resolvePackageKeysStub = sinon.stub().returns({ main: `some/file.scss` });
  const resolvePackageUrl = resolvePackageUrlFactory(
    resolveStub,
    resolvePackageKeysStub,
    t.context.dep.sassUrlVariants,
  );

  t.is(typeof resolvePackageUrl, `function`);
});

test(`Should resolve the path to a file in the node_modules directory.`, (t) => {
  const url = `some/file.scss`;
  const extensions = [`.scss`];
  const cwd = `/`;
  const packageKeys = [`main`];

  const resolveStub = { sync: sinon.stub().returns(`resolved/path.scss`) } as any;
  const resolvePackageKeysStub = sinon.stub().returns({ main: `some/file.scss` });
  const sassUrlVariantsStub = sinon.stub(t.context.dep, `sassUrlVariants`).returns([
    `some/url/variant.scss`,
  ]);
  const resolvePackageUrl = resolvePackageUrlFactory(
    resolveStub,
    resolvePackageKeysStub,
    sassUrlVariantsStub,
  );

  const file = resolvePackageUrl(url, extensions, cwd, packageKeys);

  t.true(sassUrlVariantsStub.calledWith(url, extensions));
  t.true(resolveStub.sync.calledWith(`some/url/variant.scss`));
  t.is(file, `resolved/path.scss`);
});
