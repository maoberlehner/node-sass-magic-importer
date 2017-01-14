'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var CssNodeExtract = _interopDefault(require('css-node-extract'));
var fs = _interopDefault(require('fs'));
var postcssSyntax = _interopDefault(require('postcss-scss'));
var uniqueConcat = _interopDefault(require('unique-concat'));
var cleanImportUrl = _interopDefault(require('node-sass-filter-importer/dist/lib/clean-import-url'));
var extractImportFilters = _interopDefault(require('node-sass-filter-importer/dist/lib/extract-import-filters'));
var FilterImporter = _interopDefault(require('node-sass-filter-importer/dist/lib/filter-importer'));
var GlobImporter = _interopDefault(require('node-sass-glob-importer/dist/GlobImporter'));
var PackageImporter = _interopDefault(require('node-sass-package-importer/dist/PackageImporter'));
var SelectorImporter = _interopDefault(require('node-sass-selector-importer/dist/SelectorImporter'));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @TODO: Add README info about filter importing.

/**
 * Selector specific imports, module importing,
 * globbing support, import files only once.
 */

var MagicImporter = function () {
  /**
   * @param {Object} options - Configuration options.
   */
  function MagicImporter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MagicImporter);

    var defaultOptions = {
      cwd: process.cwd(),
      includePaths: [process.cwd()],
      extensions: ['.scss', '.sass'],
      packageKeys: ['sass', 'scss', 'style', 'css', 'main.sass', 'main.scss', 'main.style', 'main.css', 'main']
    };
    /** @type {Object} */
    this.options = Object.assign({}, defaultOptions, options);
    /** @type {Object} */
    this.onceStore = {};
  }

  /**
   * Find the absolute URL for a given relative URL.
   * @param {string} url - Import url from node-sass.
   * @return {string} Absolute import url.
   */


  _createClass(MagicImporter, [{
    key: 'getAbsoluteUrl',
    value: function getAbsoluteUrl(url) {
      var absoluteUrl = url;
      if (!path.isAbsolute(url)) {
        this.options.includePaths.some(function (includePath) {
          try {
            absoluteUrl = path.normalize(path.join(includePath, absoluteUrl));
            return fs.statSync(absoluteUrl).isFile();
          } catch (e) {} // eslint-disable-line no-empty
          return false;
        });
      }
      return absoluteUrl;
    }

    /**
     * Store the given URL and selector filters
     * and determine if the URL should be imported.
     * @param {string} url - Import url from node-sass.
     * @param {Array} selectorFilters - CSS selectors and replacement selectors.
     * @return {boolean|Object} - Absolute URL and selector filters or false.
     */

  }, {
    key: 'store',
    value: function store(url) {
      var _this = this;

      var selectorFilters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      // @TODO: Add filter logic.
      var absoluteUrl = this.getAbsoluteUrl(url);

      // URL is not in store: store and load the URL.
      if (this.onceStore[absoluteUrl] === undefined) {
        this.onceStore[absoluteUrl] = selectorFilters;
        return { url: absoluteUrl, selectorFilters: selectorFilters };
      }

      // URL is in store without filters, filters given: load the URL.
      if (this.onceStore[absoluteUrl] === null && selectorFilters) {
        // eslint-disable-next-line no-console
        console.warn('Warning: double import of file "' + url + '"');
        return { url: absoluteUrl, selectorFilters: selectorFilters };
      }

      // URL and filters in store, URL without filters given:
      // load and remove filters from store.
      if (this.onceStore[absoluteUrl] && !selectorFilters) {
        // eslint-disable-next-line no-console
        console.warn('Warning: double import of file "' + url + '"');
        this.onceStore[absoluteUrl] = null;
        return { url: absoluteUrl, selectorFilters: selectorFilters };
      }

      // URL and filters in store, URL with same and other filters given:
      // only load other filters that not already are stored.
      if (this.onceStore[absoluteUrl] && selectorFilters) {
        var concatSelectorFilters = uniqueConcat(this.onceStore[absoluteUrl], selectorFilters);
        // If stored and given selector filters are identically, do not load.
        if (JSON.stringify(concatSelectorFilters) !== JSON.stringify(this.onceStore[absoluteUrl])) {
          var selectorFiltersDiff = selectorFilters.filter(function (x) {
            return !_this.onceStore[absoluteUrl].some(function (y) {
              return JSON.stringify(x) === JSON.stringify(y);
            });
          });
          this.onceStore[absoluteUrl] = concatSelectorFilters;
          return { url: absoluteUrl, selectorFilters: selectorFiltersDiff };
        }
      }
      return false;
    }

    /**
     * Synchronously resolve the path to a node-sass import url.
     * @param {string} url - Import url from node-sass.
     * @return {string} Importer object or null.
     */

  }, {
    key: 'resolveSync',
    value: function resolveSync(url) {
      var _this2 = this;

      var data = null;
      var resolvedUrl = cleanImportUrl(url);

      // Parse url and eventually extract filters.
      var filterNames = extractImportFilters(url);

      // Parse url and eventually extract selector filters.
      var selectorImporter = new SelectorImporter(this.options);
      var selectorFilters = selectorImporter.parseUrl(url).selectorFilters;

      // Try to resolve glob pattern url.
      var globImporter = new GlobImporter(this.options);
      var globFiles = globImporter.resolveFilePathsSync(resolvedUrl);
      if (globFiles.length) {
        return { contents: globFiles.map(function (x) {
            _this2.store(x);
            return fs.readFileSync(x, { encoding: 'utf8' });
          }).join('\n') };
      }

      // Try to resolve a module url.
      var packageImporter = new PackageImporter(this.options);
      var packageImportData = packageImporter.resolveSync(resolvedUrl);
      if (packageImportData) {
        resolvedUrl = packageImportData.file;
        data = { file: resolvedUrl };
      }

      var storedData = this.store(resolvedUrl, selectorFilters);

      // If the file is already stored and should not be loaded,
      // prevent node-sass from importing the file again.
      if (!storedData) {
        return {
          file: '',
          contents: ''
        };
      }

      resolvedUrl = storedData.url;
      selectorFilters = storedData.selectorFilters;

      // Filter.
      var filteredContents = void 0;
      // @TODO: This is ugly, maybe refactor.
      if (selectorFilters) {
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
     * @param {string} url - Import url from node-sass.
     * @return {Promise} Promise for importer object or null.
     */

  }, {
    key: 'resolve',
    value: function resolve(url) {
      var _this3 = this;

      return new Promise(function (promiseResolve) {
        promiseResolve(_this3.resolveSync(url));
      });
    }
  }]);

  return MagicImporter;
}();

/**
 * Magic importer for node-sass
 * @param {Object} options - Configuration options.
 */
var importer = (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var magicImporter = new MagicImporter();
  /**
   * @param {string} url - The path in import as-is, which LibSass encountered.
   * @param {string} prev - The previously resolved path.
   */
  return function importer(url, prev) {
    // Create an array of include paths to search for files.
    var includePaths = [];
    if (path.isAbsolute(prev)) {
      includePaths.push(path.dirname(prev));
    }
    magicImporter.options.includePaths = includePaths.concat(this.options.includePaths.split(path.delimiter));

    // Merge default with custom options.
    Object.assign(magicImporter.options, options);
    return magicImporter.resolveSync(url);
  };
});

/**
 * CLI importer.
 */
var cli = importer();

module.exports = cli;
