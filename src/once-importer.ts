import * as glob from 'glob';
import * as path from 'path';

import { resolveUrlFactory } from './functions/resolve-url';
import { sassGlobPatternFactory } from './functions/sass-glob-pattern';

import { IImporterOptions } from './interfaces/IImporter';

const sassGlobPattern = sassGlobPatternFactory(path);
const resolveUrl = resolveUrlFactory(glob, path, sassGlobPattern);

export default function onceImporter(options: IImporterOptions) {
  const contextTemplate = {
    store: new Set(),
  };

  return function importer(url: string, prev: string) {
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
    // TODO: Refactor inlcude paths thing in function
    const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
    if (path.isAbsolute(prev)) {
      includePathsSet.add(path.dirname(prev));
    }
    const includePaths = [...includePathsSet] as string[];
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
