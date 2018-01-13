import {
  buildIncludePaths,
  resolveGlobUrl,
} from 'node-sass-magic-importer/dist/toolbox';

export = function globImporter() {
  return function importer(url: string, prev: string) {
    const nodeSassOptions = this.options;
    const includePaths = buildIncludePaths(
      nodeSassOptions.includePaths,
      prev,
    );

    const filePaths = resolveGlobUrl(url, includePaths);

    if (filePaths) {
      const contents = filePaths
        .map((x: string) => `@import '${x}';`)
        .join(`\n`);

      return { contents };
    }

    return null;
  };
};
