'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var resolve = _interopDefault(require('resolve'));
var path = _interopDefault(require('path'));

var PackageImporter = function PackageImporter(options) {
  if ( options === void 0 ) options = {};

  var defaultOptions = {
    cwd: process.cwd(),
    extensions: [
      '.scss',
      '.sass'
    ],
    packageKeys: [
      'sass',
      'scss',
      'style',
      'css',
      'main.sass',
      'main.scss',
      'main.style',
      'main.css',
      'main'
    ]
  };
  this.options = Object.assign(defaultOptions, options);
};

PackageImporter.prototype.resolveSync = function resolveSync (url) {
    var this$1 = this;

  // Remove tilde symbol from the beginning
  // of urls (except home "~/" directory).
  var re = new RegExp(("^~(?!" + (path.sep) + ")"));
  var cleanUrl = url.replace(re, '');
  // Create url variants for partial file matching (e.g. _file.scss).
  var parsedUrl = path.parse(cleanUrl);
  var urlVariants = [cleanUrl];
  var data = null;
  if (parsedUrl.dir && !parsedUrl.ext) {
    urlVariants = this.options.extensions.reduce(function (x, extension) {
      x.push(path.join(parsedUrl.dir, ("" + (parsedUrl.name) + extension)));
      x.push(path.join(parsedUrl.dir, ("_" + (parsedUrl.name) + extension)));
      return x;
    }, urlVariants);
  }
  // Find a url variant that can be resolved.
  urlVariants.some(function (urlVariant) {
    try {
      var resolvedPath = resolve.sync(urlVariant, {
        basedir: this$1.options.cwd,
        packageFilter: function (pkg) {
          var newPkg = pkg;
          var pkgKey = this$1.options.packageKeys.find(function (x) { return pkg[x] !== 'undefined'; });
          newPkg.main = pkg[pkgKey];
          return newPkg;
        }
      });
      if (resolvedPath) {
        data = {
          file: resolvedPath
        };
        return true;
      }
    } catch (e) {}
    return false;
  });
  return data;
};

PackageImporter.prototype.resolve = function resolve$1 (url) {
    var this$1 = this;

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url));
  });
};

module.exports = PackageImporter;