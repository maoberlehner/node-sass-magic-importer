import path from 'path';
import SelectorImporter from './lib/SelectorImporter.js';

const selectorImporter = new SelectorImporter();
export default function (url, prev, done) {
  // Create an array of all paths to search for files.
  const includePaths = [];
  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev));
  }
  selectorImporter.options.includePaths = includePaths
    .concat(this.options.includePaths.split(path.delimiter));

  // Merge default with custom options.
  if (this.options.selectorImporter) {
    Object.assign(selectorImporter.options, this.options.selectorImporter);
  }
  selectorImporter.resolve(url, prev).then(contents => done(contents ? { contents } : null));
}
