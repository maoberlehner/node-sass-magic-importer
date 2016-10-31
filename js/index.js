import path from 'path';
import MagicImporter from './lib/MagicImporter.js';

/**
 * Magic importer for node-sass
 * @param {Object} options - Configuration options.
 */
export default (options = {}) => {
  const magicImporter = new MagicImporter();
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
    magicImporter.options.includePaths = includePaths
      .concat(this.options.includePaths.split(path.delimiter));

    // Merge default with custom options.
    Object.assign(magicImporter.options, options);
    return magicImporter.resolveSync(url);
  };
};
