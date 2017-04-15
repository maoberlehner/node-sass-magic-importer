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
