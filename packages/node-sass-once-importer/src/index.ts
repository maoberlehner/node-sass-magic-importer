import {
  buildIncludePaths,
  resolveUrl,
} from 'node-sass-magic-importer/dist/toolbox';
import { ImporterReturnType, AsyncImporter } from 'node-sass';
import * as md5 from 'nodejs-md5';

const EMPTY_IMPORT = {
  file: ``,
  contents: ``,
};

interface NodeSassOnceImporterContext {
  store: Set<string>
}
export = function onceImporter(): AsyncImporter {
  let nodeSassOnceImporterContext: NodeSassOnceImporterContext;

  return function importer(url: string, prev: string, done: (data: ImporterReturnType) => void) {
    const nodeSassOptions = this.options;
    // Create a context for the current importer run.
    // An importer run is different from an importer instance,
    // one importer instance can spawn infinite importer runs.
    if (!nodeSassOnceImporterContext) {
      nodeSassOnceImporterContext = {
        store: new Set(),
      };
    }

    // Each importer run has it's own new store, otherwise
    // files already imported in a previous importer run
    // would be detected as multiple imports of the same file.
    const store = nodeSassOnceImporterContext.store;

    let includePaths: Array<string> = [];

    if (nodeSassOptions.includePaths) {
      for (let path of nodeSassOptions.includePaths) {
        const paths = buildIncludePaths(path, prev);
        includePaths = [...includePaths, ...paths];
      }
    } else {
      includePaths = buildIncludePaths('', prev);
    }

    const resolvedUrl = resolveUrl(
      url,
      includePaths,
    );

    if (!md5 || !md5.file || !md5.file.quiet) {
      throw 'MD5 is not present!';
    }

    md5.file.quiet(resolvedUrl, function (err: any, result: string) {
      if (err) {
        // fallback to url
        result = resolvedUrl;
      }

      if (store.has(result)) {
        done(EMPTY_IMPORT);
      } else {
        store.add(resolvedUrl);

        done({ file: resolvedUrl });
      }
    });
  };
};
