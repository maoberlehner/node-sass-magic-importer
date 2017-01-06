import CssNodeExtract from 'css-node-extract';
import fs from 'fs';
import path from 'path';
import postcssSyntax from 'postcss-scss';

import cleanImportUrl from './clean-import-url';
import defaultOptions from './default-options';
import extractImportFilters from './extract-import-filters';

/**
 * Import only certain CSS elements form a file.
 */
export default class FilterImporter {
  /**
   * @param {Object} options
   *   Configuration options.
   */
  constructor(options = {}) {
    /** @type {Object} */
    this.options = Object.assign({}, defaultOptions, options);
  }

  /**
   * Extract filters from a file with the given url.
   *
   * @param {String} cleanUrl
   *   Cleaned up node-sass import url.
   * @param {Array} filterNames
   *   Array of filter names.
   * @return {String|null}
   *   Contents string or null.
   */
  extractFilters(cleanUrl, filterNames) {
    if (!filterNames) return null;

    let contents = null;

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
   * @param {String} url
   *   Import url from node-sass.
   * @return {Object|null}
   *   Contents object or null.
   */
  resolveSync(url) {
    const cleanUrl = cleanImportUrl(url);
    const filterNames = extractImportFilters(url);
    const contents = this.extractFilters(cleanUrl, filterNames);

    return contents ? { contents } : null;
  }

  /**
   * Asynchronously resolve filtered contents from a file with the given url.
   *
   * @param {String} url
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
