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
    const selectorFiltersMatch = url.match(/{([\s\S]*)}/);
    if (selectorFiltersMatch) {
      cleanUrl = url.replace(/(\r\n|\n|\r)/gm, ` `).split(` from `)[1].trim();
      // Create an array with selectors and replacement as one value.
      selectorFilters = selectorFiltersMatch[1].split(`,`)
        // Split selectors and replacement selectors into an array.
        .map((filter) => {
          const filterArray = filter.trim().split(` as `)
            .map(Function.prototype.call, String.prototype.trim);

          let selector = filterArray[0];
          const replacement = this.escapeSpecialCharacters(filterArray[1]);

          const matchRegExpSelector = /^\/(.+)\/([a-z]*)$/.exec(selector);
          if (matchRegExpSelector) {
            const pattern = this.escapeSpecialCharacters(matchRegExpSelector[1], `\\\\`);
            const flags = matchRegExpSelector[2];
            selector = new RegExp(pattern, flags);
          } else {
            selector = this.escapeSpecialCharacters(selector);
          }

          return {
            selector,
            replacement
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
        const css = fs.readFileSync(path.resolve(includePath, cleanUrl), { encoding: `utf8` });
        if (css) {
          contents = cssSelectorExtract.processSync(css, selectorFilters, postcssScss);
          return true;
        }
      } catch (error) {}
      return false;
    });

    return contents;
  }

  /**
   * Escape special characters.
   * @param {string} string - String to be escaped.
   * @param {string} escapeSequence - The characters which should be used for escaping.
   * @return {string} String with escaped special characters.
   */
  escapeSpecialCharacters(string, escapeSequence = `\\`) {
    if (!string) return string;

    const specialCharacters = [
      `@`
    ];
    const regexSpecialCharacters = [
      `/`
    ];
    const regex = new RegExp(
      `(?!@mixin)(${specialCharacters.join(`|`)}|\\${regexSpecialCharacters.join(`|\\`)})`, `g`
    );
    return string.replace(regex, `${escapeSequence}$1`);
  }

  /**
   * Synchronously resolve filtered contents from a file with the given url.
   * @param {string} url - Import url from node-sass.
   * @return {Object|null} Contents object or null.
   */
  resolveSync(url) {
    const data = this.parseUrl(url);
    const cleanUrl = data.url;
    const selectorFilters = data.selectorFilters;
    const contents = this.extractSelectors(cleanUrl, selectorFilters);

    return contents ? { contents } : null;
  }

  /**
   * Asynchronously resolve filtered contents from a file with the given url.
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for a contents object.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
