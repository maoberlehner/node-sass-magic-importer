import PackageImporter from './lib/PackageImporter.js';

const packageImporter = new PackageImporter();
/**
 * Package importer for node-sass
 * @param {string} url - The path in import as-is, which LibSass encountered.
 */
export default function (url) {
  if (this.options.packageImporter) {
    Object.assign(packageImporter.options, this.options.packageImporter);
  }
  const file = packageImporter.resolveSync(url);
  return file ? { file } : null;
}
