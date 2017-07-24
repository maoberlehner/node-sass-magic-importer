import * as fs from 'fs';
import * as path from 'path';

import {
  buildIncludePaths,
  cleanImportUrl,
  escapeSelector,
  extractSelectors,
  parseSelectorFilters,
  processRawSelectorFilters,
  resolveUrl,
  sassGlobPattern,
  splitSelectorFilter,
} from 'node-sass-magic-importer/dist/toolbox';

export default function selectorImporter() {
  return function importer(url: string, prev: string) {
    const nodeSassOptions = this.options;
    const selectorFilters = parseSelectorFilters(url);

    if (selectorFilters.length === 0) {
      return null;
    }

    const includePaths = buildIncludePaths(
      nodeSassOptions.includePaths,
      prev,
    );

    const cleanedUrl = cleanImportUrl(url);
    const resolvedUrl = resolveUrl(cleanedUrl, includePaths);
    const css = fs.readFileSync(resolvedUrl, { encoding: `utf8` });
    const contents = extractSelectors(css, selectorFilters);

    return contents ? { contents } : null;
  };
}
