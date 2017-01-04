import CssNodeExtract from 'css-node-extract';
import fs from 'fs';
import path from 'path';
import postcssSyntax from 'postcss-scss';

/**
 * Import only certain CSS elements form a file.
 */
export default class FilterImporter {
  /**
   * @param {Object} options
   *   Configuration options.
   */
  constructor(options = {}) {
    const defaultOptions = {
      includePaths: [process.cwd()],
    };
    /** @type {Object} */
    this.options = Object.assign({}, defaultOptions, options);
  }

  /**
   * Parse a url for filters.
   *
   * @param {string} url
   *   Import url from node-sass.
   * @return {Object}
   *   Cleaned up url and filter names array.
   */
  parseUrl(url) {
    // Find filters in the import url and
    // return a cleaned up url and the filter names.
    let cleanUrl = url;
    let filterNames;
    const selectorFiltersMatch = url.match(/\[([\s\S]*)]/);
    if (selectorFiltersMatch) {
      cleanUrl = url.replace(/(\r\n|\n|\r)/gm, ` `).split(` from `)[1].trim();
      // Create an array with filter names.
      filterNames = selectorFiltersMatch[1].split(`,`)
        .map(Function.prototype.call, String.prototype.trim);
    }
    return { url: cleanUrl, filterNames };
  }

  /**
   * Extract filters from a file with the given url.
   *
   * @param {string} cleanUrl
   *   Cleaned up import url from node-sass.
   * @param {Array} filterNames
   *   Array of filter names array.
   * @return {string}
   *   Contents string or null.
   */
  extractFilters(cleanUrl, filterNames) {
    let contents = null;

    if (!filterNames) {
      return contents;
    }

    this.options.includePaths.some((includePath) => {
      try {
        const css = fs.readFileSync(path.resolve(includePath, cleanUrl), { encoding: `utf8` });
        if (css) {
          contents = CssNodeExtract.processSync({ css, filterNames, postcssSyntax });
          return true;
        }
      } catch (error) {} // eslint-disable-line no-empty
      return false;
    });

    return contents;
  }

  /**
   * Synchronously resolve filtered contents from a file with the given url.
   *
   * @param {string} url
   *   Import url from node-sass.
   * @return {Object|null}
   *   Contents object or null.
   */
  resolveSync(url) {
    const data = this.parseUrl(url);
    const cleanUrl = data.url;
    const filterNames = data.filterNames;
    const contents = this.extractFilters(cleanUrl, filterNames);

    return contents ? { contents } : null;
  }

  /**
   * Asynchronously resolve filtered contents from a file with the given url.
   *
   * @param {string} url
   *   Import url from node-sass.
   * @return {Promise}
   *   Promise for a contents object.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
