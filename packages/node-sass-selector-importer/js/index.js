import SelectorImporter from './lib/SelectorImporter.js';

const selectorImporter = new SelectorImporter();
export default function (url, prev, done) {
  if (this.options.selectorImporter) {
    selectorImporter.options = Object.assign(selectorImporter.options, this.options.selectorImporter);
  }
  selectorImporter.resolve(url).then(file => done(file ? { file } : null));
}
