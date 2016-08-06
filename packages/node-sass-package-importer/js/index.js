import PackageImporter from './lib/PackageImporter.js';

const packageImporter = new PackageImporter();
export default function (url, prev, done) {
  if (this.options.packageImporter) {
    packageImporter.options = Object.assign(packageImporter.options, this.options.packageImporter);
  }
  packageImporter.resolve(url).then(data => done(data));
}
