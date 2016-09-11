import path from 'path';
import MagicImporter from './lib/MagicImporter.js';

const magicImporter = new MagicImporter();
/**
 * Magic importer for node-sass
 * @param {string} url - The path in import as-is, which LibSass encountered.
 * @param {string} prev - The previously resolved path.
 * @param {Function} done - A callback function to invoke on async completion.
 */
export default function (url, prev, done) {
  // Create an array of include paths to search for files.
  const includePaths = [];
  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev));
  }
  magicImporter.options.includePaths = includePaths
    .concat(this.options.includePaths.split(path.delimiter));

  // Merge default with custom options.
  if (this.options.magicImporter) {
    Object.assign(magicImporter.options, this.options.magicImporter);
  }
  magicImporter.resolve(url).then(data => done(data));
}
