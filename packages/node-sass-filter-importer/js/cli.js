import path from 'path';
import FilterImporter from './lib/FilterImporter';

const filterImporter = new FilterImporter();

/**
 * Filter importer for node-sass
 *
 * @param {string} url
 *   The path in import as-is, which LibSass encountered.
 * @param {string} prev
 *   The previously resolved path.
 */
export default function (url, prev) {
  // Create an array of include paths to search for files.
  const includePaths = [];
  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev));
  }
  filterImporter.options.includePaths = includePaths
    .concat(this.options.includePaths.split(path.delimiter));

  return filterImporter.resolveSync(url);
}
