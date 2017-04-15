import * as path from 'path';

import { selectorImporterFactory } from './classes/SelectorImporter';

import { IImporterOptions } from './interfaces/IImporter';

export default function selectorImporter(options: IImporterOptions) {
  const selectorImporter = selectorImporterFactory();

  return function importer(url: string, prev: string) {
    const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
    if (path.isAbsolute(prev)) {
      includePathsSet.add(path.dirname(prev));
    }
    const includePaths = [...includePathsSet] as string[];

    return selectorImporter.import(url, includePaths);
  };
}
