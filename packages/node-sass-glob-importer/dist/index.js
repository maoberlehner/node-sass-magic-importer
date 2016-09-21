'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var concat = _interopDefault(require('unique-concat'));
var glob = _interopDefault(require('glob'));
var path = _interopDefault(require('path'));

/**
 * Import files using glob patterns.
 */
var GlobImporter = function GlobImporter () {};

GlobImporter.prototype.resolveSync = function resolveSync (url, includePaths) {
    if ( includePaths === void 0 ) includePaths = [process.cwd()];

  if (glob.hasMagic(url)) {
    return includePaths.reduce(function (absolutePathStore, includePath) {
      // Try to resolve the glob pattern.
      var newAbsolutePaths = glob
        .sync(url, { cwd: includePath })
        .map(function (relativePath) {
          var absolutePath = path.resolve(includePath, relativePath);
          // node-sass fails to resolve absolute paths with forwardslashes on
          // windows systems. Because of that we use this hack, replacing them
          // with backslashes.
          if (/^win/.test(process.platform)) absolutePath = absolutePath.split('\\').join('/');
          return absolutePath;
        });
      // Merge new paths with previously found ones.
      return concat(absolutePathStore, newAbsolutePaths);
    }, []);
  }
  return null;
};

/**
 * Asynchronously resolve the path to a node-sass import url.
 * @param {string} url - Import url from node-sass.
 * @param {Array} includePaths - Paths to consider for importing files.
 * @return {Promise} Promise for an array of fully resolved import urls.
 */
GlobImporter.prototype.resolve = function resolve (url, includePaths) {
    var this$1 = this;
    if ( includePaths === void 0 ) includePaths = [process.cwd()];

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url, includePaths));
  });
};

/**
 * Glob importer for node-sass
 * @return {function} Returns a node-sass importer function.
 */
GlobImporter.prototype.importer = function importer () {
  var self = this;
  return function nodeSassImporter(url, prev, done) {
    var importer = this;
    // Create a set of all paths to search for files.
    var includePaths = [];
    if (path.isAbsolute(prev)) {
      includePaths.push(path.dirname(prev));
    }
    includePaths = concat(includePaths, importer.options.includePaths.split(path.delimiter));
    // Try to resolve the url.
    self.resolve(url, includePaths).then(function (files) {
      if (files) {
        var contents = files.map(function (x) { return ("@import '" + x + "';"); }).join('\n');
        done({ contents: contents });
      } else {
        done(null);
      }
    });
  };
};

var globImporter = new GlobImporter();
var index = globImporter.importer();

module.exports = index;