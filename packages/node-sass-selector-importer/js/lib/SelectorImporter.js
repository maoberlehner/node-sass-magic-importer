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

  parseUrl(url) {
    // Find selectors in the import url and
    // return a cleaned up url and the selectors.
    let cleanUrl = this.cleanUrl(url);
    let selectorFilters;
    const selectorFiltersMatch = url.match(/{([^}]+)}/);
    if (selectorFiltersMatch) {
      cleanUrl = url.replace(/(\r\n|\n|\r)/gm, ' ').split(' from ')[1].trim();
      // Create an array with selectors and replacement as one value.
      selectorFilters = selectorFiltersMatch[1].split(',')
        // Trim unnecessary whitespace.
        .map(Function.prototype.call, String.prototype.trim)
        // Split selectors and replacement selectors into an array.
        .map((currentValue, index) => currentValue.split(' as ')
          .map(Function.prototype.call, String.prototype.trim));
    }
    return { cleanUrl, selectorFilters };
  }

  /**
   * Clean a node sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {string} Cleaned url.
   */
  cleanUrl(url) {
    // Remove tilde symbol from the beginning
    // of urls (except home "~/" directory).
    const re = new RegExp(`^~(?!${path.sep})`);
    return url.replace(re, '');
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
