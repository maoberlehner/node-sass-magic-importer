import cssSelectorExtract from 'css-selector-extract';
import path from 'path';

export default class SelectorImporter {
  /**
   * Import packages from the `node_modules` directory.
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
    const defaultOptions = {
      cwd: process.cwd()
    };
    this.options = Object.assign(defaultOptions, options);
  }

  /**
   * Synchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {string} Fully resolved import url or null.
   */
  resolveSync(url) {
    const cleanUrl = this.cleanUrl(url);
    const urlVariants = this.urlVariants(cleanUrl);
    let file = null;
    // Find a url variant that can be resolved.
    urlVariants.some(urlVariant => {
      try {
        const resolvedPath = resolve.sync(urlVariant, {
          basedir: this.options.cwd,
          packageFilter: pkg => this.resolveFilter(pkg)
        });
        if (resolvedPath) {
          file = resolvedPath;
          return true;
        }
      } catch (e) {}
      return false;
    });
    return file;
  }

  /**
   * Asynchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for a fully resolved import url.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
