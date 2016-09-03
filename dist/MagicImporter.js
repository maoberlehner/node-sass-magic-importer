'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var GlobImporter = _interopDefault(require('node-sass-glob-importer/dist/GlobImporter.js'));
var nodeSassPackageImporter_dist_PackageImporter_js = require('node-sass-package-importer/dist/PackageImporter.js');
var nodeSassSelectorImporter_dist_SelectorImporter_js = require('node-sass-selector-importer/dist/SelectorImporter.js');

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

  // Try to resolve glob pattern url.
  var globImporter = new GlobImporter();
  var globFiles = globImporter.resolveSync(url, this.options.includePaths);
  if (globFiles) {
    return { contents: globFiles.map(function (x) { return ("@import '" + x + "';"); }).join('\n') };
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