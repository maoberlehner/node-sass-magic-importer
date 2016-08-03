'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var concat = _interopDefault(require('unique-concat'));
var glob = require('glob');
var path = _interopDefault(require('path'));

var PackageImporter = function PackageImporter () {};

PackageImporter.resolveSync = function resolveSync (
  url,
  includePaths
) {
    if ( includePaths === void 0 ) includePaths = [process.cwd()];

  // if (glob.hasMagic(url)) {
  // const absolutePaths = includePaths.reduce((absolutePathStore, includePath) => {
  //   // Try to resolve the glob pattern.
  //   const newAbsolutePaths = glob
  //     .sync(url, { cwd: includePath })
  //     .map(relativePath => `@import '${path.resolve(includePath, relativePath)}';`);
  //   // Merge new paths with previously found ones.
  //   return concat(absolutePathStore, newAbsolutePaths);
  // }, []);
  // if (absolutePaths.length) {
  //   return { contents: absolutePaths.join('\n') };
  // }
  // }
  return null;
};

PackageImporter.resolve = function resolve (
  url,
  includePaths
) {
    if ( includePaths === void 0 ) includePaths = [process.cwd()];

  return new Promise(function (promiseResolve) {
    promiseResolve(PackageImporter.resolveSync(url, includePaths));
  });
};

PackageImporter.importer = function importer (directories, packageKeys) {
  return function nodeSassImporter(url, prev, done) {
    var importer = this;
    // Create a set of all paths to search for files.
    var includePaths = [];
    if (path.isAbsolute(prev)) {
      includePaths.push(path.dirname(prev));
    }
    includePaths = concat(includePaths, importer.options.includePaths.split(path.delimiter));
    // Try to resolve the url.
    PackageImporter.resolve(url, includePaths).then(function (data) {
      done(data);
    });
  };
};

var defaultDirectories = ['node_modules', 'bower_components'];
var defaultPackageKeys = [
  'sass',
  'scss',
  'style',
  'css',
  'main.sass',
  'main.scss',
  'main.style',
  'main.css',
  'main'
];

function index (directories, packageKeys) {
    if ( directories === void 0 ) directories = defaultDirectories;
    if ( packageKeys === void 0 ) packageKeys = defaultPackageKeys;

    return PackageImporter.importer(directories, packageKeys);
};

exports.PackageImporter = PackageImporter;
exports['default'] = index;