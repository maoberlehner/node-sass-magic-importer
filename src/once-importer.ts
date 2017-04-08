import * as path from 'path';

import { onceImporterFactory } from './classes/OnceImporter';

import { IImporterOptions } from './interfaces/IImporter';

export default function onceImporter(options: IImporterOptions) {
  const defaultOptions = { cwd: process.cwd() };
  const importerOptions = Object.assign({}, defaultOptions, options);
  const onceImporter = onceImporterFactory(importerOptions);

  return function importer(url, prev) {
    const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
    if (path.isAbsolute(prev)) {
      includePathsSet.add(path.dirname(prev));
    }
    const includePaths = [...includePathsSet] as string[];

    return onceImporter.import(url, includePaths);
  };
};
