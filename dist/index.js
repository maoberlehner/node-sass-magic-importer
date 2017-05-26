'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var uniqueConcat = _interopDefault(require('unique-concat'));
var CssNodeExtract = _interopDefault(require('css-node-extract'));
var fs = _interopDefault(require('fs'));
var glob = _interopDefault(require('glob'));
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
  disableWarnings: false,
  disableImportOnce: false
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
    /** @type {Object} */
    this.store = {};
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
      var _this = this;

      var absoluteUrl = url;
      if (!path.isAbsolute(url)) {
        this.options.includePaths.some(function (includePath) {
          var globMatch = glob.sync(path.join(includePath, path.parse(url).dir, '?(_)' + path.parse(url).name + '@(' + _this.options.extensions.join('|') + ')'));

          if (globMatch.length) {
            absoluteUrl = globMatch[0];
            return true;
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
     * @param {Number} storeKey
     *   A unique identifier for each compile run.
     */

  }, {
    key: 'storeAdd',
    value: function storeAdd(cleanUrl) {
      var storeKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var absoluteUrl = this.getAbsoluteUrl(cleanUrl);
      if (!this.store[storeKey]) {
        this.store[storeKey] = [];
      }
      if (!this.store[storeKey].includes(absoluteUrl)) this.store[storeKey].push(absoluteUrl);
    }

    /**
     * Check if an URL is in store, add it if is not and it has no filters.
     *
     * @param {String} cleanUrl
     *   Cleaned up import url from node-sass.
     * @param {Boolean} hasFilters
     *   Does the URL have filters or not.
     * @param {Number} storeKey
     *   A unique identifier for each compile run.
     * @return {boolean}
     *   Returns true if the URL has no filters and is already stored.
     */

  }, {
    key: 'isInStore',
    value: function isInStore(cleanUrl) {
      var hasFilters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var storeKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      var absoluteUrl = this.getAbsoluteUrl(cleanUrl);

      if (!this.store[storeKey]) {
        this.store[storeKey] = [];
      }

      if (!hasFilters && this.store[storeKey] && this.store[storeKey].includes(absoluteUrl)) {
        return true;
      }

      if (hasFilters && this.store[storeKey].includes(absoluteUrl)) {
        if (!this.options.disableWarnings) {
          // eslint-disable-next-line no-console
          console.warn('Warning: double import of file "' + absoluteUrl + '".');
        }
        return false;
      }

      return false;
    }

    /**
     * Synchronously resolve the path to a node-sass import url.
     *
     * @param {String} url
     *   Import url from node-sass.
     * @param {Number} storeKey
     *   A unique identifier for each compile run.
     * @return {String}
     *   Importer object or null.
     */

  }, {
    key: 'resolveSync',
    value: function resolveSync(url, storeKey) {
      var _this2 = this;

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
            if (!_this2.isInStore(globUrl, hasFilters, storeKey) || _this2.options.disableImportOnce) {
              if (!hasFilters) _this2.storeAdd(globUrl, storeKey);
              return fs.readFileSync(globUrl, { encoding: 'utf8' });
            }
            if (!hasFilters) _this2.storeAdd(globUrl, storeKey);
            return '';
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
      if (this.isInStore(resolvedUrl, hasFilters, storeKey) && !this.options.disableImportOnce) {
        return {
          file: '',
          contents: ''
        };
      }

      if (!hasFilters) this.storeAdd(resolvedUrl, storeKey);

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
     * @param {String} url
     *   Import url from node-sass.
     * @param {Number} storeKey
     *   A unique identifier for each compile run.
     * @return {Promise}
     *   Promise for importer object or null.
     */

  }, {
    key: 'resolve',
    value: function resolve(url, storeKey) {
      var _this3 = this;

      return new Promise(function (promiseResolve) {
        promiseResolve(_this3.resolveSync(url, storeKey));
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
var index = (function () {
  var customOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var importerInstanceId = 1;
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
    if (!this.magicImporterInstanceId) {
      this.magicImporterInstanceId = importerInstanceId;
      importerInstanceId += 1;
    }
    var nodeSassIncludePaths = this.options.includePaths.split(path.delimiter);

    if (path.isAbsolute(prev)) nodeSassIncludePaths.push(path.dirname(prev));
    magicImporter.options.includePaths = uniqueConcat(options.includePaths, nodeSassIncludePaths).filter(function (item) {
      return item.length;
    });

    return magicImporter.resolveSync(url, this.magicImporterInstanceId);
  };
});

module.exports = index;
