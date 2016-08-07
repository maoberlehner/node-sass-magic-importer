'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var concat = _interopDefault(require('unique-concat'));
var glob = _interopDefault(require('glob'));
var path = _interopDefault(require('path'));

var GlobImporter = function GlobImporter () {};

GlobImporter.prototype.resolveSync = function resolveSync (url, includePaths) {
    if ( includePaths === void 0 ) includePaths = [process.cwd()];

  if (glob.hasMagic(url)) {
    var absolutePaths = includePaths.reduce(function (absolutePathStore, includePath) {
      // Try to resolve the glob pattern.
      var newAbsolutePaths = glob
        .sync(url, { cwd: includePath })
        .map(function (relativePath) { return ("@import '" + (path.resolve(includePath, relativePath)) + "';"); });
      // Merge new paths with previously found ones.
      return concat(absolutePathStore, newAbsolutePaths);
    }, []);
    if (absolutePaths.length) {
      return { contents: absolutePaths.join('\n') };
    }
  }
  return null;
};

GlobImporter.prototype.resolve = function resolve (url, includePaths) {
    var this$1 = this;
    if ( includePaths === void 0 ) includePaths = [process.cwd()];

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url, includePaths));
  });
};

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
    self.resolve(url, includePaths).then(function (data) { return done(data); });
  };
};

module.exports = GlobImporter;