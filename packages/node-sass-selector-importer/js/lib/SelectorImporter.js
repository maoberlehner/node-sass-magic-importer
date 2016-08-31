// import cssSelectorExtract from 'css-selector-extract';
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
    this.options = Object.assign({}, defaultOptions, options);
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
        .map((currentValue) => currentValue.split(' as ')
          .map(Function.prototype.call, String.prototype.trim));
    }
    return { url: cleanUrl, selectorFilters };
  }

  /**
   * Synchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {string} Fully resolved import url or null.
   */
  resolveSync(url) {
    return url;
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
