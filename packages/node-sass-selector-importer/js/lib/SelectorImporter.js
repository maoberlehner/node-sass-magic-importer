import cssSelectorExtract from 'css-selector-extract';
import fs from 'fs';
import path from 'path';
import postcssScss from 'postcss-scss';

export default class SelectorImporter {
  /**
   * Import only certain CSS selectors form a file.
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
    const defaultOptions = {
      includePaths: [process.cwd()]
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

  /**
   * Parse a url for selector filters.
   * @param {string} url - Import url from node-sass.
   * @return {Object} Cleaned up url and selector filter array.
   */
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
   * Extract and replace selectors from a file with the given url.
   * @param {string} cleanUrl - Cleaned up import url from node-sass.
   * @param {Array} selectorFilters - Selector filter array.
   * @return {string} Contents string or null.
   */
  extractSelectors(cleanUrl, selectorFilters) {
    let contents = null;

    if (!selectorFilters) {
      return contents;
    }

    const preparedSelectorFilters = selectorFilters.map(selectorFilter => ({
      selector: selectorFilter[0],
      replacement: selectorFilter[1]
    }));

    this.options.includePaths.some((includePath) => {
      try {
        const css = fs.readFileSync(path.join(includePath, cleanUrl), { encoding: 'utf8' });
        if (css) {
          contents = cssSelectorExtract.processSync(css, preparedSelectorFilters, postcssScss);
          return true;
        }
      } catch (e) {}
      return false;
    });

    return contents;
  }

  /**
   * Synchronously resolve filtered contentes from a file with the given url.
   * @param {string} url - Import url from node-sass.
   * @return {string} Contents string or null.
   */
  resolveSync(url) {
    const data = this.parseUrl(url);
    const cleanUrl = data.url;
    const selectorFilters = data.selectorFilters;

    return this.extractSelectors(cleanUrl, selectorFilters);
  }

  /**
   * Asynchronously resolve filtered contentes from a file with the given url.
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for a contents string.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
