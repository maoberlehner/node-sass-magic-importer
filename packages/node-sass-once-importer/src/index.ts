import {
  buildIncludePaths,
  resolveUrl,
} from 'node-sass-magic-importer/dist/toolbox';

const EMPTY_IMPORT = {
  file: ``,
  contents: ``,
};

export = function onceImporter() {
  return function importer(url: string, prev: string) {
    const nodeSassOptions = this.options;
    // Create a context for the current importer run.
    // An importer run is different from an importer instance,
    // one importer instance can spawn infinite importer runs.
    if (!this.nodeSassOnceImporterContext) {
      this.nodeSassOnceImporterContext = {
        store: new Set(),
      };
    }

    // Each importer run has it's own new store, otherwise
    // files already imported in a previous importer run
    // would be detected as multiple imports of the same file.
    const store = this.nodeSassOnceImporterContext.store;
    const includePaths = buildIncludePaths(
      nodeSassOptions.includePaths,
      prev,
    );
    const resolvedUrl = resolveUrl(
      url,
      includePaths,
    );

    if (store.has(resolvedUrl)) {
      return EMPTY_IMPORT;
    }

    store.add(resolvedUrl);

    return null;
  };
};
