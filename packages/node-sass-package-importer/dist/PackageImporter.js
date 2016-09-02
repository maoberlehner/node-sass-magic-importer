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
  this.options = Object.assign({}, defaultOptions, options);
};

/**
 * Synchronously resolve the path to a node-sass import url.
 * @param {string} url - Import url from node-sass.
 * @return {string} Fully resolved import url or null.
 */
PackageImporter.prototype.resolveSync = function resolveSync (url) {
    var this$1 = this;

  var cleanUrl = this.cleanUrl(url);
  var urlVariants = this.urlVariants(cleanUrl);
  var file = null;
  // Find a url variant that can be resolved.
  urlVariants.some(function (urlVariant) {
    try {
      var resolvedPath = resolve.sync(urlVariant, {
        basedir: this$1.options.cwd,
        packageFilter: function (pkg) { return this$1.resolveFilter(pkg); }
      });
      if (resolvedPath) {
        file = resolvedPath;
        return true;
      }
    } catch (e) {}
    return false;
  });
  return file;
};

/**
 * Asynchronously resolve the path to a node-sass import url.
 * @param {string} url - Import url from node-sass.
 * @return {Promise} Promise for a fully resolved import url.
 */
PackageImporter.prototype.resolve = function resolve$1 (url) {
    var this$1 = this;

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url));
  });
};

/**
 * Clean a node sass import url.
 * @param {string} url - Import url from node-sass.
 * @return {string} Cleaned url.
 */
PackageImporter.prototype.cleanUrl = function cleanUrl (url) {
  // Remove tilde symbol from the beginning
  // of urls (except home "~/" directory).
  var re = new RegExp(("^~(?!" + (path.sep) + ")"));
  return url.replace(re, '');
};

/**
 * Create url variants for partial file matching (e.g. _file.scss).
 * @param {string} url - Import url from node-sass.
 * @return {Array} Multiple variants of sass file names.
 */
PackageImporter.prototype.urlVariants = function urlVariants (url) {
  var parsedUrl = path.parse(url);
  var urlVariants = [url];
  if (parsedUrl.dir && !parsedUrl.ext) {
    urlVariants = this.options.extensions.reduce(function (x, extension) {
      x.push(path.join(parsedUrl.dir, ("" + (parsedUrl.name) + extension)));
      x.push(path.join(parsedUrl.dir, ("_" + (parsedUrl.name) + extension)));
      return x;
    }, urlVariants);
  }
  return urlVariants;
};

/**
 * Find the first matching key in a package.json file
 * and set it as value for the `main` field.
 * @param{Object} pkg - Contents of a package.json.
 * @return {Object} A package.json object with a replaced main value.
 */
PackageImporter.prototype.resolveFilter = function resolveFilter (pkg) {
  var newPkg = pkg;
  var pkgKey = this.options.packageKeys.find(function (x) { return pkg[x] !== undefined; });
  newPkg.main = pkg[pkgKey];
  return newPkg;
};

module.exports = PackageImporter;