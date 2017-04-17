// TODO: Test all the things.

import test from 'ava';
import * as cssSelectorExtract from 'css-selector-extract';
import * as fs from 'fs';
import * as postcssScss from 'postcss-scss';
import * as sinon from 'sinon';

import cleanImportUrl from '../functions/clean-import-url';
import parseSelectorFilters from '../functions/parse-selector-filters';
import resolveUrl from '../functions/resolve-url';

import { IDependencies, SelectorImporter } from './SelectorImporter';

test.beforeEach((t) => {
  t.context.dependencies = {
    cleanImportUrl,
    cssSelectorExtract,
    fs,
    parseSelectorFilters,
    postcssScss,
    resolveUrl,
  } as IDependencies;
});

test(`Should be an object.`, (t) => {
  const selectorImporter = new SelectorImporter(t.context.dependencies);

  t.is(typeof selectorImporter, `object`);
});

test(`Should parse selector filters, clean and resolve the given URL and extract selectors.`, (t) => {
  const url = `test/url`;
  const includePaths = [`/`];

  const cleanImportUrlStub = sinon.stub().returns(`cleaned/url`);
  const cssSelectorExtractStub = { processSync: sinon.stub() };
  const fsStub = { readFileSync: sinon.stub().returns(`css`) };
  const parseSelectorFiltersStub = sinon.stub().returns([`selectorFilters`]);
  const resolveUrlStub = sinon.stub().returns(`resolved/url`);
  const dependencies = Object.assign(
    t.context.dependencies,
    {
      cleanImportUrl: cleanImportUrlStub,
      cssSelectorExtract: cssSelectorExtractStub,
      fs: fsStub,
      parseSelectorFilters: parseSelectorFiltersStub,
      resolveUrl: resolveUrlStub,
    },
  );
  const selectorImporter = new SelectorImporter(dependencies);

  selectorImporter.import(url, includePaths);

  t.true(parseSelectorFiltersStub.calledWith(url));
  t.true(cleanImportUrlStub.calledWith(url));
  t.true(resolveUrlStub.calledWith(`cleaned/url`, includePaths));
  t.true(cssSelectorExtractStub.processSync.calledWith(`css`, [`selectorFilters`]));
});
