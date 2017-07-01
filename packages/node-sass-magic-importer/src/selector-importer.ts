import * as cssSelectorExtract from 'css-selector-extract';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as postcssScss from 'postcss-scss';

import { cleanImportUrlFactory } from './functions/clean-import-url';
import { escapeSelectorFactory } from './functions/escape-selector';
import { extractSelectorsFactory } from './functions/extract-selectors';
import { parseSelectorFiltersFactory } from './functions/parse-selector-filters';
import { processRawSelectorFiltersFactory } from './functions/process-raw-selector-filters';
import { resolveUrlFactory } from './functions/resolve-url';
import { sassGlobPatternFactory } from './functions/sass-glob-pattern';
import { splitSelectorFilterFactory } from './functions/split-selector-filter';

import { IImporterOptions } from './interfaces/IImporter';

const cleanImportUrl = cleanImportUrlFactory();
const sassGlobPattern = sassGlobPatternFactory(path);
const resolveUrl = resolveUrlFactory(glob, path, sassGlobPattern);
const escapeSelector = escapeSelectorFactory();
const extractSelectors = extractSelectorsFactory(cssSelectorExtract, fs, postcssScss);
const processRawSelectorFilters = processRawSelectorFiltersFactory(escapeSelector);
const splitSelectorFilter = splitSelectorFilterFactory();
const parseSelectorFilters = parseSelectorFiltersFactory(
  processRawSelectorFilters,
  splitSelectorFilter,
);

export default function selectorImporter(options: IImporterOptions) {
  return function importer(url: string, prev: string) {
    // TODO: Refactor inlcude paths thing in function
    const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
    if (path.isAbsolute(prev)) {
      includePathsSet.add(path.dirname(prev));
    }
    const includePaths = [...includePathsSet] as string[];
    const selectorFilters = parseSelectorFilters(url);

    if (selectorFilters.length === 0) {
      return null;
    }

    const cleanedUrl = cleanImportUrl(url);
    const resolvedUrl = resolveUrl(cleanedUrl, includePaths);
    const contents = extractSelectors(resolvedUrl, selectorFilters);

    return contents ? { contents } : null;
  };
}
