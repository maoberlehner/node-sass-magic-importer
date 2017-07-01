import PackageImporter from './lib/PackageImporter.js';

/**
 * Package importer for node-sass
 * @param {Object} options - Configuration options.
 */
export default (options = {}) => {
  const packageImporter = new PackageImporter(options);
  /**
   * @param {string} url - The path in import as-is, which LibSass encountered.
   */
  return function importer(url) {
    return packageImporter.resolveSync(url);
  };
};
