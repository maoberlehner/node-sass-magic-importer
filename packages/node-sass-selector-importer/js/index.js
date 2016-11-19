import path from 'path';
import SelectorImporter from './lib/SelectorImporter.js';

/**
 * Selector importer for node-sass
 * @param {Object} options - Configuration options.
 */
export default (options = {}) => {
  const selectorImporter = new SelectorImporter();
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
    selectorImporter.options.includePaths = includePaths
      .concat(this.options.includePaths.split(path.delimiter));

    // Merge default with custom options.
    Object.assign(selectorImporter.options, options);
    return selectorImporter.resolveSync(url);
  };
};
