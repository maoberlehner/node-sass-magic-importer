import concat from 'unique-concat';
import glob from 'glob';
import path from 'path';

export default class GlobImporter {
  resolveSync(url, includePaths = [process.cwd()]) {
    if (glob.hasMagic(url)) {
      const absolutePaths = includePaths.reduce((absolutePathStore, includePath) => {
        // Try to resolve the glob pattern.
        const newAbsolutePaths = glob
          .sync(url, { cwd: includePath })
          .map(relativePath => `@import '${path.resolve(includePath, relativePath)}';`);
        // Merge new paths with previously found ones.
        return concat(absolutePathStore, newAbsolutePaths);
      }, []);
      if (absolutePaths.length) {
        return { contents: absolutePaths.join('\n') };
      }
    }
    return null;
  }

  resolve(url, includePaths = [process.cwd()]) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url, includePaths));
    });
  }

  importer() {
    const self = this;
    return function nodeSassImporter(url, prev, done) {
      const importer = this;
      // Create a set of all paths to search for files.
      let includePaths = [];
      if (path.isAbsolute(prev)) {
        includePaths.push(path.dirname(prev));
      }
      includePaths = concat(includePaths, importer.options.includePaths.split(path.delimiter));
      // Try to resolve the url.
      self.resolve(url, includePaths).then(data => done(data));
    };
  }
}
