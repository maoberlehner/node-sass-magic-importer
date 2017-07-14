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
    const contents = extractSelectors(resolvedUrl, selectorFilters);

    return contents ? { contents } : null;
  };
}
