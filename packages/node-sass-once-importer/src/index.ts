import * as path from 'path';

import {
  buildIncludePaths,
  resolveUrl,
  sassGlobPattern,
} from 'node-sass-magic-importer/dist/toolbox';

import { IImporterOptions } from 'node-sass-magic-importer/dist/interfaces/IImporter';

export default function onceImporter(options: IImporterOptions) {
  const contextTemplate = {
    store: new Set(),
  };

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
    const includePaths = buildIncludePaths(
      nodeSassOptions.includePaths,
      prev,
    );
    const resolvedUrl = resolveUrl(
      url,
      includePaths,
    );

    if (store.has(resolvedUrl)) {
      return {
        file: ``,
        contents: ``,
      };
    }

    store.add(resolvedUrl);

    return null;
  };
}
