import path from 'path';
import GlobImporter from './lib/GlobImporter.js';

/**
 * Glob importer for node-sass
 * @param {Object} options - Configuration options.
 */
export default (options = {}) => {
  const globImporter = new GlobImporter();
  /**
   * @param {string} url - The path in import as-is, which LibSass encountered.
   * @param {string} prev - The previously resolved path.
   */
  return function importer(url, prev) {
    // Create an array of include paths to search for files.
    const includePaths = [];
    if (path.isAbsolute(prev)) {
      includePaths.push(path.dirname(prev));
    }
    globImporter.options.includePaths = includePaths
      .concat(this.options.includePaths.split(path.delimiter));

    // Merge default with custom options.
    Object.assign(globImporter.options, options);
    return globImporter.resolveSync(url);
  };
};
