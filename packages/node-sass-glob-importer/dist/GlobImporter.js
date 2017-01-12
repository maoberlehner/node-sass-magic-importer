'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var concat = _interopDefault(require('unique-concat'));
var fs = _interopDefault(require('fs'));
var glob = _interopDefault(require('glob'));
var path = _interopDefault(require('path'));

/**
 * Import files using glob patterns.
 */
var GlobImporter = function GlobImporter(options) {
  if ( options === void 0 ) options = {};

  var defaultOptions = {
    includePaths: [process.cwd()]
  };
  /** @type {Object} */
  this.options = Object.assign({}, defaultOptions, options);
};

/**
 * Synchronously resolve node-sass import url glob paths.
 * @param {string} url - Import url from node-sass.
 * @return {Array} File paths array.
 */
GlobImporter.prototype.resolveFilePathsSync = function resolveFilePathsSync (url) {
  var filePaths = [];

  if (glob.hasMagic(url)) {
    filePaths = this.options.includePaths
      .reduce(function (absolutePathStore, includePath) {
        // Try to resolve the glob pattern.
        var newAbsolutePaths = glob
          .sync(url, { cwd: includePath })
          .map(function (relativePath) { return path.resolve(includePath, relativePath); });
        // Merge new paths with previously found ones.
        return concat(absolutePathStore, newAbsolutePaths);
      }, []);
  }

  return filePaths;
};

/**
 * Asynchronously resolve node-sass import url glob paths.
 * @param {string} url - Import url from node-sass.
 * @return {Promise} Promise for a file paths array.
 */
GlobImporter.prototype.resolveFilePaths = function resolveFilePaths (url) {
    var this$1 = this;

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveFilePathsSync(url));
  });
};

/**
 * Synchronously resolve filtered contents from glob files with the given url.
 * @param {string} url - Import url from node-sass.
 * @return {Object|null} Contents object or null.
 */
GlobImporter.prototype.resolveSync = function resolveSync (url) {
  var filePaths = this.resolveFilePathsSync(url);

  if (filePaths.length) {
    var contents = filePaths
      .map(function (x) { return fs.readFileSync(x, { encoding: "utf8" }); })
      .join("\n");

    return { contents: contents };
  }

  return null;
};

/**
 * Asynchronously resolve filtered contents
 * from glob files with the given url.
 * @param {string} url - Import url from node-sass.
 * @return {Promise} Promise for a contents object.
 */
GlobImporter.prototype.resolve = function resolve (url) {
    var this$1 = this;

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url));
  });
};

module.exports = GlobImporter;
