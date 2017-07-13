import {
  buildIncludePaths,
  resolveGlobUrl,
} from 'node-sass-magic-importer/dist/toolbox';

import { IImporterOptions } from 'node-sass-magic-importer/dist/interfaces/IImporter';

export default function globImporter() {
  return function importer(url: string, prev: string) {
    const nodeSassOptions = this.options;
    const includePaths = buildIncludePaths(
      nodeSassOptions.includePaths,
      prev,
    );

    const filePaths = resolveGlobUrl(url, includePaths);

    if (filePaths.length) {
      const contents = filePaths
        .map((x: string) => `@import '${x}';`)
        .join(`\n`);

      return { contents };
    }

    return null;
  };
}
