import * as cssNodeExtract from 'css-node-extract';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as postcssScss from 'postcss-scss';

import { cleanImportUrlFactory } from './functions/clean-import-url';
import { extractNodesFactory } from './functions/extract-nodes';
import { parseNodeFiltersFactory } from './functions/parse-node-filters';
import { resolveUrlFactory } from './functions/resolve-url';
import { sassGlobPatternFactory } from './functions/sass-glob-pattern';

import { IImporterOptions } from './interfaces/IImporter';

const cleanImportUrl = cleanImportUrlFactory();
const parseNodeFilters = parseNodeFiltersFactory();
const sassGlobPattern = sassGlobPatternFactory(path);
const resolveUrl = resolveUrlFactory(glob, path, sassGlobPattern);
const extractNodes = extractNodesFactory(cssNodeExtract, fs, postcssScss);

export default function nodeImporter(options: IImporterOptions) {
  return function importer(url: string, prev: string) {
    // TODO: Refactor inlcude paths thing in function
    const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
    if (path.isAbsolute(prev)) {
      includePathsSet.add(path.dirname(prev));
    }
    const includePaths = [...includePathsSet] as string[];
    const nodeFilters = parseNodeFilters(url);

    if (nodeFilters.length === 0) {
      return null;
    }

    const cleanedUrl = cleanImportUrl(url);
    const resolvedUrl = resolveUrl(cleanedUrl, includePaths);
    const contents = extractNodes(resolvedUrl, nodeFilters);

    return contents ? { contents } : null;
  };
}
