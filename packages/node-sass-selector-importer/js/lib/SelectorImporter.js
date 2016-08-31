import cssSelectorExtract from 'css-selector-extract';
import fs from 'fs';
import path from 'path';

export default class SelectorImporter {
  /**
   * Import packages from the `node_modules` directory.
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
    const defaultOptions = {};
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
    const data = this.parseUrl(url);
    const cleanUrl = data.url;
    const selectorFilters = data.selectorFilters;
    const selectors = [];
    const replacementSelectors = {};
    let contents = null;

    if (!selectorFilters) {
      return contents;
    }

    // TODO: refactor.
    selectorFilters.forEach((selectorFilter) => {
      selectors.push(selectorFilter[0]);
      if (selectorFilter[1]) {
        replacementSelectors[selectorFilter[0]] = selectorFilter[1];
      }
    });

    this.options.includePaths.some((includePath) => {
      const css = fs.readFileSync(path.join(includePath, cleanUrl), { encoding: 'utf8' });
      if (css) {
        contents = cssSelectorExtract.processSync(css, selectors, replacementSelectors);
        return true;
      }
      return false;
    });

    return contents;
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
