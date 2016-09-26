import cssSelectorExtract from 'css-selector-extract';
import fs from 'fs';
import path from 'path';
import postcssScss from 'postcss-scss';

/**
 * Import only certain CSS selectors form a file.
 */
export default class SelectorImporter {
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
   * Parse a url for selector filters.
   * @param {string} url - Import url from node-sass.
   * @return {Object} Cleaned up url and selector filter array.
   */
  parseUrl(url) {
    // Find selectors in the import url and
    // return a cleaned up url and the selectors.
    let cleanUrl = url;
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
          .map(Function.prototype.call, String.prototype.trim))
        .map((currentValue) => {
          const matchRegExpSelector = /^\/(.+)\/([a-z]*)$/.exec(currentValue[0]);
          if (matchRegExpSelector) {
            const pattern = matchRegExpSelector[1];
            const flags = matchRegExpSelector[2];
            currentValue[0] = new RegExp(pattern, flags);
          }
          return {
            selector: currentValue[0],
            replacement: currentValue[1]
          };
        });
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

    this.options.includePaths.some((includePath) => {
      try {
        const css = fs.readFileSync(path.join(includePath, cleanUrl), { encoding: 'utf8' });
        if (css) {
          contents = cssSelectorExtract.processSync(css, selectorFilters, postcssScss);
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
