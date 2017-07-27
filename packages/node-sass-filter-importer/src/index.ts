import * as cssNodeExtract from 'css-node-extract';
import * as fs from 'fs';
import * as path from 'path';
import * as postcssSyntax from 'postcss-scss';

import {
  buildIncludePaths,
  cleanImportUrl,
  parseNodeFilters,
  resolveUrl,
  sassGlobPattern,
} from 'node-sass-magic-importer/dist/toolbox';

export default function nodeImporter() {
  return function importer(url: string, prev: string) {
    const nodeSassOptions = this.options;
    const nodeFilters = parseNodeFilters(url);

    if (nodeFilters.length === 0) {
      return null;
    }

    const includePaths = buildIncludePaths(
      nodeSassOptions.includePaths,
      prev,
    );

    const cleanedUrl = cleanImportUrl(url);
    const resolvedUrl = resolveUrl(cleanedUrl, includePaths);
    const css = fs.readFileSync(resolvedUrl, { encoding: `utf8` });
    const contents = cssNodeExtract.processSync({
      css,
      filters: nodeFilters,
      postcssSyntax,
    });

    return contents ? { contents } : null;
  };
}
