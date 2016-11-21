import PackageImporter from './lib/PackageImporter.js';

const packageImporter = new PackageImporter();

/**
 * Package importer for node-sass
 * @param {string} url - The path in import as-is, which LibSass encountered.
 */
export default function (url) {
  return packageImporter.resolveSync(url);
}
