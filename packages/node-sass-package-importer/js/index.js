import PackageImporter from './lib/PackageImporter.js';

const packageImporter = new PackageImporter();
export default function (url, prev, done) {
  if (this.options.packageImporter) {
    Object.assign(packageImporter.options, this.options.packageImporter);
  }
  packageImporter.resolve(url).then(file => done(file ? { file } : null));
}
