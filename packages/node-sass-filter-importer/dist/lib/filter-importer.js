'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var CssNodeExtract = _interopDefault(require('css-node-extract'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var postcssSyntax = _interopDefault(require('postcss-scss'));

// .replace(/(\r\n|\n|\r)/gm, ` `)

var cleanImportUrl = (function () {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  var cleanUrl = url.split("from").reverse()[0].trim();

  return cleanUrl;
});

var defaultOptions = {
  includePaths: [process.cwd()]
};

var extractImportFilters = (function () {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  var filterMatch = string.match(/\[([\s\S]*)]/);

  if (filterMatch && filterMatch[1]) {
    return filterMatch[1].split(",").map(function (item) {
      return item.trim();
    });
  }

  return [];
});

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
   * @param {string} cleanUrl
   *   Cleaned up import url from node-sass.
   * @param {Array} filterNames
   *   Array of filter names array.
   * @return {string}
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
     * @param {string} url
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
     * @param {string} url
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

module.exports = FilterImporter;
