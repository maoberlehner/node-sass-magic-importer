import concat from 'unique-concat';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

/**
 * Import files using glob patterns.
 */
export default class GlobImporter {
  /**
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
    const defaultOptions = {
      includePaths: [process.cwd()]
    };
    /** @type {Object} */
    this.options = Object.assign({}, defaultOptions, options);
  }

  /**
   * Synchronously resolve node-sass import url glob paths.
   * @param {string} url - Import url from node-sass.
   * @return {Array} File paths array.
   */
  resolveFilePathsSync(url) {
    let filePaths = [];

    if (glob.hasMagic(url)) {
      filePaths = this.options.includePaths
        .reduce((absolutePathStore, includePath) => {
          // Try to resolve the glob pattern.
          const newAbsolutePaths = glob
            .sync(url, { cwd: includePath })
            .map(relativePath => path.resolve(includePath, relativePath));
          // Merge new paths with previously found ones.
          return concat(absolutePathStore, newAbsolutePaths);
        }, []);
    }

    return filePaths;
  }

  /**
   * Asynchronously resolve node-sass import url glob paths.
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for a file paths array.
   */
  resolveFilePaths(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveFilePathsSync(url));
    });
  }

  /**
   * Synchronously resolve filtered contents from glob files with the given url.
   * @param {string} url - Import url from node-sass.
   * @return {Object|null} Contents object or null.
   */
  resolveSync(url) {
    const filePaths = this.resolveFilePathsSync(url);

    if (filePaths.length) {
      const contents = filePaths
        .map(x => fs.readFileSync(x, { encoding: `utf8` }))
        .join(`\n`);

      return { contents };
    }

    return null;
  }

  /**
   * Asynchronously resolve filtered contents
   * from glob files with the given url.
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for a contents object.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
