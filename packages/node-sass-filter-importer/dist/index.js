'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var uniqueConcat = _interopDefault(require('unique-concat'));
var CssNodeExtract = _interopDefault(require('css-node-extract'));
var fs = _interopDefault(require('fs'));
var postcssSyntax = _interopDefault(require('postcss-scss'));

/**
 * Default options.
 *
 * @type {Object}
 */
var defaultOptions = {
  includePaths: [process.cwd()]
};

/**
 * Clean an import url from filters.
 *
 * @param {String} url
 *   Import url from node-sass.
 * @return {String}
 *   Cleaned up node-sass import url.
 */
function cleanImportUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  var cleanUrl = url.split("from").reverse()[0].trim();

  return cleanUrl;
}

/**
 * Extract import filters from a string.
 *
 * @param {String} string
 *   A string that may contains import filters.
 * @return {Array}
 *   Array of found import filters.
 */
function extractImportFilters() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  var filterMatch = string.match(/\[([\s\S]*)]/);

  if (filterMatch && filterMatch[1]) {
    return filterMatch[1].split(",").map(function (item) {
      return item.trim();
    });
  }

  return [];
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Import only certain CSS elements form a file.
 */

var FilterImporter = function () {
  /**
   * @param {Object} options
   *   Configuration options.
   */
  function FilterImporter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, FilterImporter);

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


  _createClass(FilterImporter, [{
    key: 'extractFilters',
    value: function extractFilters(cleanUrl, filterNames) {
      if (!filterNames) return null;

      var contents = null;

      this.options.includePaths.some(function (includePath) {
        try {
          var css = fs.readFileSync(path.resolve(includePath, cleanUrl), { encoding: 'utf8' });
          if (css) {
            contents = CssNodeExtract.processSync({ css: css, filterNames: filterNames, postcssSyntax: postcssSyntax });
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

  }, {
    key: 'resolveSync',
    value: function resolveSync(url) {
      var cleanUrl = cleanImportUrl(url);
      var filterNames = extractImportFilters(url);
      var contents = this.extractFilters(cleanUrl, filterNames);

      return contents ? { contents: contents } : null;
    }

    /**
     * Asynchronously resolve filtered contents from a file with the given url.
     *
     * @param {String} url
     *   Import url from node-sass.
     * @return {Promise}
     *   Promise for a contents object.
     */

  }, {
    key: 'resolve',
    value: function resolve(url) {
      var _this = this;

      return new Promise(function (promiseResolve) {
        promiseResolve(_this.resolveSync(url));
      });
    }
  }]);

  return FilterImporter;
}();

/**
 * Filter importer for node-sass.
 *
 * @param {Object} customOptions
 *   Custom configuration options.
 * @return {Function}
 *   node-sass custom importer function.
 */
var index = (function () {
  var customOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = Object.assign({}, defaultOptions, customOptions);
  var filterImporter = new FilterImporter(options);

  /**
   * @param {string} url
   *   The path in import as-is, which LibSass encountered.
   * @param {string} prev
   *   The previously resolved path.
   * @return {Object|null}
   *   node-sass custom importer data object or null.
   */
  return function importer(url, prev) {
    var nodeSassIncludePaths = this.options.includePaths.split(path.delimiter);

    if (path.isAbsolute(prev)) nodeSassIncludePaths.push(path.dirname(prev));
    filterImporter.options.includePaths = uniqueConcat(options.includePaths, nodeSassIncludePaths).filter(function (item) {
      return item.length;
    });

    return filterImporter.resolveSync(url);
  };
});

module.exports = index;
