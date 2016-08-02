// @TODO: import form bower_compoents (scan main object in the bower.json for (s|a|c)ss files)
// @TODO: do not return scss, return @import statements (multiple if multiple files are found in the main in the bower_json)
// @TODO: treat every *.json object as possible array
// @TODO: make search order configurable (and maybe possible to modify with the import url) 

import concat from 'unique-concat';
import glob from 'glob';
import path from 'path';

export class PackageImporter {
    _resolveModule(url, cwd = process.cwd()) {
    return new Promise((promiseResolve, promiseReject) => {
      let resolvedUrl;
      let parsedUrl = path.parse(url);
      let urlArray = url.split('/');
      let moduleName = urlArray[0];
      if (urlArray.length == 1) {
        // Only module name given, search for style file
        // in the package.json of the module.
        let globResult = glob.sync(path.join('**', moduleName, 'package.json'), { cwd: path.join(cwd, 'node_modules') });
        if (globResult.length) {
          let packagePath = path.join(cwd, 'node_modules', globResult[0]);
          let packageJson = require(packagePath);
          let fileName = packageJson.sass || packageJson['main.sass'] || packageJson['main.scss'] || packageJson.style || 'index.scss';
          resolvedUrl = path.join(path.dirname(packagePath), fileName);
        }
      } else if (!parsedUrl.ext) {
        // No file ending provided, assume SASS partial naming.
        let partialFileName = `?(_)${parsedUrl.name}.@(scss|sass|css)`;
        let globPattern = path.join(parsedUrl.dir, partialFileName);
        let globResult = glob.sync(path.join('**', globPattern), { cwd: path.join(cwd, 'node_modules') });
        if (globResult.length) {
          resolvedUrl = path.join(cwd, 'node_modules', globResult[0]);
        }
      } else {
        // Load given file from module.
        let globResult = glob.sync(path.join('**', url), { cwd: path.join(cwd, 'node_modules') });
        if (globResult.length) {
          resolvedUrl = path.join(cwd, 'node_modules', globResult[0]);
        }
      }
      // Finish the promise call.
      if (resolvedUrl) {
        promiseResolve(resolvedUrl);
      } else {
        promiseReject(`Module path "${url}" could not be resolved.`);
      }
    });
  }

  static resolveSync(
    url,
    includePaths = [process.cwd()]
  ) {
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

  static resolve(
    url,
    includePaths = [process.cwd()]
  ) {
    return new Promise((promiseResolve) => {
      promiseResolve(GlobImporter.resolveSync(url, includePaths));
    });
  }

  importer() {
    return function nodeSassImporter(url, prev, done) {
      const importer = this;
      // Create a set of all paths to search for files.
      let includePaths = [];
      if (path.isAbsolute(prev)) {
        includePaths.push(path.dirname(prev));
      }
      includePaths = concat(includePaths, importer.options.includePaths.split(path.delimiter));
      // Try to resolve the url.
      GlobImporter.resolve(url, includePaths).then((data) => {
        done(data);
      });
    };
  }
}

const packageImporter = new PackageImporter();
export default packageImporter.importer();
