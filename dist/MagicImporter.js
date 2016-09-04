'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var GlobImporter = _interopDefault(require('node-sass-glob-importer/dist/GlobImporter.js'));
var PackageImporter = _interopDefault(require('node-sass-package-importer/dist/PackageImporter.js'));
var SelectorImporter = _interopDefault(require('node-sass-selector-importer/dist/SelectorImporter.js'));

var MagicImporter = function MagicImporter(options) {
  if ( options === void 0 ) options = {};

  var defaultOptions = {
    includePaths: [process.cwd()]
  };
  this.options = Object.assign({}, defaultOptions, options);
};

/**
 * Synchronously resolve the path to a node-sass import url.
 * @param {string} url - Import url from node-sass.
 * @return {string} Fully resolved import url or null.
 */
MagicImporter.prototype.resolveSync = function resolveSync (url) {
  var data = null;
  var resolvedUrl = url;

  // Try to resolve glob pattern url.
  var globImporter = new GlobImporter();
  var globFiles = globImporter.resolveSync(url, this.options.includePaths);
  if (globFiles) {
    return { contents: globFiles.map(function (x) { return ("@import '" + x + "';"); }).join('\n') };
  }

  // Parse url to eventually extract selector filters.
  var selectorImporter = new SelectorImporter();
  selectorImporter.options.includePaths = this.options.includePaths;
  var urlData = selectorImporter.parseUrl(resolvedUrl);
  var selectorFilters = urlData.selectorFilters;
  resolvedUrl = urlData.url;

  // Try to resolve a module url.
  var packageImporter = new PackageImporter();
  var packageFile = packageImporter.resolveSync(resolvedUrl);
  if (packageFile) {
    resolvedUrl = packageFile;
    data = { file: resolvedUrl };
  }

  // Filter selectors.
  var filteredContents = selectorImporter.extractSelectors(resolvedUrl, selectorFilters);
  if (filteredContents) {
    data = { contents: filteredContents };
  }

  return data;
};

/**
 * Asynchronously resolve the path to a node-sass import url.
 * @param {string} url - Import url from node-sass.
 * @return {Promise} Promise for a fully resolved import url.
 */
MagicImporter.prototype.resolve = function resolve (url) {
    var this$1 = this;

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url));
  });
};

module.exports = MagicImporter;