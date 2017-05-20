import * as path from 'path';

import { nodeImporterFactory } from './classes/NodeImporter';

import { IImporterOptions } from './interfaces/IImporter';

export default function nodeImporter(options: IImporterOptions) {
  const nodeImporter = nodeImporterFactory();

  return function importer(url: string, prev: string) {
    const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
    if (path.isAbsolute(prev)) {
      includePathsSet.add(path.dirname(prev));
    }
    const includePaths = [...includePathsSet] as string[];

    return nodeImporter.import(url, includePaths);
  };
}
