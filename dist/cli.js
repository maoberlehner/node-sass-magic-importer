'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var uniqueConcat = _interopDefault(require('unique-concat'));
var CssNodeExtract = _interopDefault(require('css-node-extract'));
var fs = _interopDefault(require('fs'));
var postcssSyntax = _interopDefault(require('postcss-scss'));
var cleanImportUrl = _interopDefault(require('node-sass-filter-importer/dist/lib/clean-import-url'));
var extractImportFilters = _interopDefault(require('node-sass-filter-importer/dist/lib/extract-import-filters'));
var FilterImporter = _interopDefault(require('node-sass-filter-importer/dist/lib/filter-importer'));
var GlobImporter = _interopDefault(require('node-sass-glob-importer/dist/GlobImporter'));
var PackageImporter = _interopDefault(require('node-sass-package-importer/dist/PackageImporter'));
var SelectorImporter = _interopDefault(require('node-sass-selector-importer/dist/SelectorImporter'));

/**
 * Default options.
 *
 * @type {Object}
 */
var defaultOptions = {
  cwd: process.cwd(),
  includePaths: [process.cwd()],
  extensions: [".scss", ".sass"],
  packageKeys: ["sass", "scss", "style", "css", "main.sass", "main.scss", "main.style", "main.css", "main"],
  prefix: "~",
  disableWarnings: false
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Selector specific imports, filter imports, module importing,
 * globbing support and import files only once.
 */

var MagicImporter = function () {
  /**
   * @param {Object} options - Configuration options.
   */
  function MagicImporter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MagicImporter);

    /** @type {Object} */
    this.options = Object.assign({}, defaultOptions, options);
    /** @type {Array} */
    this.store = [];
  }

  /**
   * Find the absolute URL for a given relative URL.
   *
   * @param {String} url
   *   Import url from node-sass.
   * @return {String}
   *   Absolute import url.
   */


  _createClass(MagicImporter, [{
    key: 'getAbsoluteUrl',
    value: function getAbsoluteUrl(url) {
      var absoluteUrl = url;
      if (!path.isAbsolute(url)) {
        this.options.includePaths.some(function (includePath) {
          try {
            absoluteUrl = path.normalize(path.resolve(includePath, absoluteUrl));
            return fs.statSync(absoluteUrl).isFile();
          } catch (e) {
            absoluteUrl = url;
          }
          return false;
        });
      }
      return absoluteUrl;
    }

    /**
     * Add an URL to the store of imported URLs.
     *
     * @param {String} cleanUrl
     *   Cleaned up import url from node-sass.
     */

  }, {
    key: 'storeAdd',
    value: function storeAdd(cleanUrl) {
      var absoluteUrl = this.getAbsoluteUrl(cleanUrl);
      if (!this.store.includes(absoluteUrl)) this.store.push(absoluteUrl);
    }

    /**
     * Check if an URL is in store, add it if is not and it has no filters.
     *
     * @param {String} cleanUrl
     *   Cleaned up import url from node-sass.
     * @param {Boolean} hasFilters
     *   Does the URL have filters or not.
     * @return {boolean}
     *   Returns true if the URL has no filters and is already stored.
     */

  }, {
    key: 'isInStore',
    value: function isInStore(cleanUrl) {
      var hasFilters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var absoluteUrl = this.getAbsoluteUrl(cleanUrl);

      if (!hasFilters && this.store.includes(absoluteUrl)) return true;

      if (hasFilters && this.store.includes(absoluteUrl)) {
        if (!this.options.disableWarnings) {
          // eslint-disable-next-line no-console
          console.warn('Warning: double import of file "' + absoluteUrl + '".');
        }
        return false;
      }

      if (!hasFilters) this.storeAdd(cleanUrl);

      return false;
    }

    /**
     * Synchronously resolve the path to a node-sass import url.
     *
     * @param {String} url
     *   Import url from node-sass.
     * @return {String}
     *   Importer object or null.
     */

  }, {
    key: 'resolveSync',
    value: function resolveSync(url) {
      var _this = this;

      var data = null;
      var resolvedUrl = cleanImportUrl(url);

      // Parse url and eventually extract filters.
      var filterNames = extractImportFilters(url);

      // Parse url and eventually extract selector filters.
      var selectorImporter = new SelectorImporter(this.options);
      var selectorFilters = selectorImporter.parseUrl(url).selectorFilters || [];
      var hasFilters = filterNames.length || selectorFilters.length;

      // Try to resolve glob pattern url.
      var globImporter = new GlobImporter(this.options);
      var globFiles = globImporter.resolveFilePathsSync(resolvedUrl);
      if (globFiles.length) {
        return { contents: globFiles.map(function (globUrl) {
            _this.storeAdd(globUrl, hasFilters);
            return fs.readFileSync(globUrl, { encoding: 'utf8' });
          }).join('\n') };
      }

      // Try to resolve a module url.
      var packageImporter = new PackageImporter(this.options);
      var packageImportData = packageImporter.resolveSync(resolvedUrl);
      if (packageImportData) {
        resolvedUrl = packageImportData.file;
        data = { file: resolvedUrl };
      }

      // If the file is already stored and should not be loaded,
      // prevent node-sass from importing the file again.
      if (this.isInStore(resolvedUrl, hasFilters)) {
        return {
          file: '',
          contents: ''
        };
      }

      // Filter.
      var filteredContents = void 0;
      // @TODO: This is ugly, maybe refactor.
      if (selectorFilters.length) {
        filteredContents = selectorImporter.extractSelectors(resolvedUrl, selectorFilters);
      }
      if (filterNames.length) {
        if (filteredContents) {
          filteredContents = CssNodeExtract.processSync({
            css: filteredContents,
            filterNames: filterNames,
            postcssSyntax: postcssSyntax
          });
        } else {
          var filterImporter = new FilterImporter(this.options);
          filteredContents = filterImporter.extractFilters(resolvedUrl, filterNames);
        }
      }
      if (filteredContents) {
        data = {
          file: resolvedUrl,
          contents: filteredContents
        };
      }

      return data;
    }

    /**
     * Asynchronously resolve the path to a node-sass import url.
     *
     * @param {string} url
     *   Import url from node-sass.
     * @return {Promise}
     *   Promise for importer object or null.
     */

  }, {
    key: 'resolve',
    value: function resolve(url) {
      var _this2 = this;

      return new Promise(function (promiseResolve) {
        promiseResolve(_this2.resolveSync(url));
      });
    }
  }]);

  return MagicImporter;
}();

/**
 * Magic importer for node-sass.
 *
 * @param {Object} customOptions
 *   Custom configuration options.
 * @return {Function}
 *   node-sass custom importer function.
 */
var importer = (function () {
  var customOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = Object.assign({}, defaultOptions, customOptions);
  var magicImporter = new MagicImporter(options);

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
    magicImporter.options.includePaths = uniqueConcat(options.includePaths, nodeSassIncludePaths).filter(function (item) {
      return item.length;
    });

    return magicImporter.resolveSync(url);
  };
});

/**
 * CLI importer.
 */
var cli = importer();

module.exports = cli;
