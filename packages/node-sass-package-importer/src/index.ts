import {
  buildIncludePaths,
  resolvePackageUrl,
  sassUrlVariants,
} from 'node-sass-magic-importer/dist/toolbox';

import { IImporterOptions } from 'node-sass-magic-importer/dist/interfaces/IImporter';

export default function packageImporter(options: any) {
  const defaultOptions = {
    cwd: process.cwd(),
    extensions: [
      `.scss`,
      `.sass`,
    ],
    packageKeys: [
      `sass`,
      `scss`,
      `style`,
      `css`,
      `main.sass`,
      `main.scss`,
      `main.style`,
      `main.css`,
      `main`,
    ],
    prefix: `~`,
  };
  options = Object.assign({}, defaultOptions, options);

  const escapedPrefix = options.prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, `\\$&`);
  const matchPackageUrl = new RegExp(`^${escapedPrefix}(?!/)`);

  return function importer(url: string, prev: string) {
    const nodeSassOptions = this.options;

    if (!url.match(matchPackageUrl)) {
      return null;
    }

    const includePaths = buildIncludePaths(
      nodeSassOptions.includePaths,
      prev,
    );

    const cleanedUrl = url.replace(matchPackageUrl, ``);
    const file = resolvePackageUrl(
      cleanedUrl,
      options.extensions,
      options.cwd,
      options.packageKeys,
    );

    // TODO: Wirklich css replacen? Why? Why not?
    return file ? { file: file.replace(/\.css$/, ``) } : null;
  };
}
