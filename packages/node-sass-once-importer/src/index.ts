import * as path from 'path';

import {
  buildIncludePaths,
  resolveUrl,
  sassGlobPattern,
} from 'node-sass-magic-importer/dist/toolbox';

const EMPTY_IMPORT = {
  file: ``,
  contents: ``,
};

export = function onceImporter() {
  const contextTemplate = {
    store: new Set(),
  };

  // cache for path resolution
  let includePathsCache: Map<string, string[]> = new Map();
  // cache for resolvedUrls
  let resolvedUrlsCache: Map<string, string> = new Map();

  return function importer(url: string, prev: string) {
    const nodeSassOptions = this.options;
    // Create a context for the current importer run.
    // An importer run is different from an importer instance,
    // one importer instance can spawn infinite importer runs.
    if (!this.nodeSassOnceImporterContext) {
      this.nodeSassOnceImporterContext = Object.assign({}, contextTemplate);
    }

    // Each importer run has it's own new store, otherwise
    // files already imported in a previous importer run
    // would be detected as multiple imports of the same file.
    const store = this.nodeSassOnceImporterContext.store;
    // per instance of new importer created, path resolution is shared
    if (!includePathsCache.has(nodeSassOptions.includePaths)) {
      includePathsCache.set(url, buildIncludePaths(
        nodeSassOptions.includePaths,
        prev,
      ));
    }
    const includePaths = includePathsCache.get(nodeSassOptions.includePaths);

    if (!resolvedUrlsCache.has(url)){
      resolvedUrlsCache.set(url, resolveUrl(
        url,
        includePaths,
      ));
    }
    const resolvedUrl = resolvedUrlsCache.get(url);

    if (store.has(resolvedUrl)) {
      return EMPTY_IMPORT;
    }

    store.add(resolvedUrl);

    return null;
  };
};
