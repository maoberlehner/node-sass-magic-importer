// TODO: Test all the things.

import test from 'ava';
import * as cssNodeExtract from 'css-node-extract';
import * as fs from 'fs';
import * as postcssScss from 'postcss-scss';
import * as sinon from 'sinon';

import cleanImportUrl from '../functions/clean-import-url';
import parseNodeFilters from '../functions/parse-node-filters';
import resolveUrl from '../functions/resolve-url';

import { IDependencies, NodeImporter } from './NodeImporter';

test.beforeEach((t) => {
  t.context.dependencies = {
    cleanImportUrl,
    cssNodeExtract,
    fs,
    parseNodeFilters,
    postcssScss,
    resolveUrl,
  } as IDependencies;
});

test(`Should be an object.`, (t) => {
  const nodeImporter = new NodeImporter(t.context.dependencies);

  t.is(typeof nodeImporter, `object`);
});

test(`Should parse node filters, clean and resolve the given URL and extract nodes.`, (t) => {
  const url = `test/url`;
  const includePaths = [`/`];

  const cleanImportUrlStub = sinon.stub().returns(`cleaned/url`);
  const cssNodeExtractStub = { processSync: sinon.stub() };
  const fsStub = { readFileSync: sinon.stub().returns(`css`) };
  const parseNodeFiltersStub = sinon.stub().returns([`nodeFilters`]);
  const resolveUrlStub = sinon.stub().returns(`resolved/url`);
  const dependencies = Object.assign(
    t.context.dependencies,
    {
      cleanImportUrl: cleanImportUrlStub,
      cssNodeExtract: cssNodeExtractStub,
      fs: fsStub,
      parseNodeFilters: parseNodeFiltersStub,
      resolveUrl: resolveUrlStub,
    },
  );
  const nodeImporter = new NodeImporter(dependencies);

  nodeImporter.import(url, includePaths);

  t.true(parseNodeFiltersStub.calledWith(url));
  t.true(cleanImportUrlStub.calledWith(url));
  t.true(resolveUrlStub.calledWith(`cleaned/url`, includePaths));
  t.true(cssNodeExtractStub.processSync.calledWith({
    css: `css`,
    filterNames: [`nodeFilters`],
    postcssSyntax: postcssScss,
  }));
});
