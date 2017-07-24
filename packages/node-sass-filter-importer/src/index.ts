import * as fs from 'fs';
import * as path from 'path';

import {
  buildIncludePaths,
  cleanImportUrl,
  extractNodes,
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
    const contents = extractNodes(css, nodeFilters);

    return contents ? { contents } : null;
  };
}
