import path from 'path';
import SelectorImporter from './lib/SelectorImporter.js';

const selectorImporter = new SelectorImporter();

/**
 * Selector importer for node-sass
 * @param {string} url - The path in import as-is, which LibSass encountered.
 * @param {string} prev - The previously resolved path.
 */
export default function (url, prev) {
  // Create an array of include paths to search for files.
  const includePaths = [];
  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev));
  }
  selectorImporter.options.includePaths = includePaths
    .concat(this.options.includePaths.split(path.delimiter));

  return selectorImporter.resolveSync(url);
}
