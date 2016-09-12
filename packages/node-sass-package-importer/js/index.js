import PackageImporter from './lib/PackageImporter.js';

const packageImporter = new PackageImporter();
/**
 * Package importer for node-sass
 * @param {string} url - The path in import as-is, which LibSass encountered.
 * @param {string} prev - The previously resolved path.
 * @param {Function} done - A callback function to invoke on async completion.
 */
export default function (url, prev, done) {
  if (this.options.packageImporter) {
    Object.assign(packageImporter.options, this.options.packageImporter);
  }
  packageImporter.resolve(url).then(file => done(file ? { file } : null));
}
