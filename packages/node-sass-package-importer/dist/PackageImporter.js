'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var resolve = _interopDefault(require('resolve'));
var path = _interopDefault(require('path'));

/**
 * Import packages from the `node_modules` directory.
 */
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
    ],
    pathSep: path.sep
  };
  /**
   * @type {Object}
   */
  this.options = Object.assign({}, defaultOptions, options);
  /**
   * Match tilde symbol at the beginning of urls (except home "~/" directory).
   * @type {RegExp}
   */
  var pathSep = (options.pathSep === '/') ? options.pathSep : '\\\\'; 
  //const pathSep = options.pathSep.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');  
  this.matchPackageUrl = new RegExp(("^~(?!" + (pathSep) + ")"));
};

/**
 * Synchronously resolve the path to a node-sass import url.
 * @param {string} url - Import url from node-sass.
 * @return {string} Fully resolved import url or null.
 */
PackageImporter.prototype.resolveSync = function resolveSync (url) {
    var this$1 = this;

  var file = null;
  if (!url.match(this.matchPackageUrl)) {
    return file;
  }
  var cleanUrl = this.cleanUrl(url);
  var urlVariants = this.urlVariants(cleanUrl);
  // Find a url variant that can be resolved.
  urlVariants.some(function (urlVariant) {
    try {
      var resolvedPath = resolve.sync(urlVariant, {
        basedir: this$1.options.cwd,
        packageFilter: function (pkg) { return this$1.resolveFilter(pkg); },
        extensions: this$1.options.extensions
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
  return url.replace(this.matchPackageUrl, '');
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
