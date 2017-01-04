'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var CssNodeExtract = _interopDefault(require('css-node-extract'));
var fs = _interopDefault(require('fs'));
var postcssSyntax = _interopDefault(require('postcss-scss'));

/**
 * Import only certain CSS elements form a file.
 */
var FilterImporter = function FilterImporter(options) {
  if ( options === void 0 ) options = {};

  var defaultOptions = {
    includePaths: [process.cwd()],
  };
  /** @type {Object} */
  this.options = Object.assign({}, defaultOptions, options);
};

/**
 * Parse a url for filters.
 *
 * @param {string} url
 * Import url from node-sass.
 * @return {Object}
 * Cleaned up url and filter names array.
 */
FilterImporter.prototype.parseUrl = function parseUrl (url) {
  // Find filters in the import url and
  // return a cleaned up url and the filter names.
  var cleanUrl = url;
  var filterNames;
  var selectorFiltersMatch = url.match(/\[([\s\S]*)]/);
  if (selectorFiltersMatch) {
    cleanUrl = url.replace(/(\r\n|\n|\r)/gm, " ").split(" from ")[1].trim();
    // Create an array with filter names.
    filterNames = selectorFiltersMatch[1].split(",")
      .map(Function.prototype.call, String.prototype.trim);
  }
  return { url: cleanUrl, filterNames: filterNames };
};

/**
 * Extract filters from a file with the given url.
 *
 * @param {string} cleanUrl
 * Cleaned up import url from node-sass.
 * @param {Array} filterNames
 * Array of filter names array.
 * @return {string}
 * Contents string or null.
 */
FilterImporter.prototype.extractFilters = function extractFilters (cleanUrl, filterNames) {
  var contents = null;

  if (!filterNames) {
    return contents;
  }

  this.options.includePaths.some(function (includePath) {
    try {
      var css = fs.readFileSync(path.resolve(includePath, cleanUrl), { encoding: "utf8" });
      if (css) {
        contents = CssNodeExtract.processSync({ css: css, filterNames: filterNames, postcssSyntax: postcssSyntax });
        return true;
      }
    } catch (error) {} // eslint-disable-line no-empty
    return false;
  });

  return contents;
};

/**
 * Synchronously resolve filtered contents from a file with the given url.
 *
 * @param {string} url
 * Import url from node-sass.
 * @return {Object|null}
 * Contents object or null.
 */
FilterImporter.prototype.resolveSync = function resolveSync (url) {
  var data = this.parseUrl(url);
  var cleanUrl = data.url;
  var filterNames = data.filterNames;
  var contents = this.extractFilters(cleanUrl, filterNames);

  return contents ? { contents: contents } : null;
};

/**
 * Asynchronously resolve filtered contents from a file with the given url.
 *
 * @param {string} url
 * Import url from node-sass.
 * @return {Promise}
 * Promise for a contents object.
 */
FilterImporter.prototype.resolve = function resolve (url) {
    var this$1 = this;

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url));
  });
};

/**
 * Filter importer for node-sass
 *
 * @param {Object} options
 *   Configuration options.
 */
var index = function (options) {
  if ( options === void 0 ) options = {};

  var filterImporter = new FilterImporter();
  /**
   * @param {string} url
   *   The path in import as-is, which LibSass encountered.
   * @param {string} prev
   *   The previously resolved path.
   */
  return function importer(url, prev) {
    // Create an array of include paths to search for files.
    var includePaths = [];
    if (path.isAbsolute(prev)) {
      includePaths.push(path.dirname(prev));
    }
    filterImporter.options.includePaths = includePaths
      .concat(this.options.includePaths.split(path.delimiter));

    // Merge default with custom options.
    Object.assign(filterImporter.options, options);
    return filterImporter.resolveSync(url);
  };
};

module.exports = index;
