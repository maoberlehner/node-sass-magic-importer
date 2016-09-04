'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var cssSelectorExtract = _interopDefault(require('css-selector-extract'));
var fs = _interopDefault(require('fs'));

var SelectorImporter = function SelectorImporter(options) {
  if ( options === void 0 ) options = {};

  var defaultOptions = {
    includePaths: [process.cwd()]
  };
  this.options = Object.assign({}, defaultOptions, options);
};

/**
 * Clean a node sass import url.
 * @param {string} url - Import url from node-sass.
 * @return {string} Cleaned url.
 */
SelectorImporter.prototype.cleanUrl = function cleanUrl (url) {
  // Remove tilde symbol from the beginning
  // of urls (except home "~/" directory).
  var re = new RegExp(("^~(?!" + (path.sep) + ")"));
  return url.replace(re, '');
};

/**
 * Parse a url for selector filters.
 * @param {string} url - Import url from node-sass.
 * @return {Object} Cleaned up url and selector filter object.
 */
SelectorImporter.prototype.parseUrl = function parseUrl (url) {
  // Find selectors in the import url and
  // return a cleaned up url and the selectors.
  var cleanUrl = this.cleanUrl(url);
  var selectorFilters;
  var selectorFiltersMatch = url.match(/{([^}]+)}/);
  if (selectorFiltersMatch) {
    cleanUrl = url.replace(/(\r\n|\n|\r)/gm, ' ').split(' from ')[1].trim();
    // Create an array with selectors and replacement as one value.
    selectorFilters = selectorFiltersMatch[1].split(',')
      // Trim unnecessary whitespace.
      .map(Function.prototype.call, String.prototype.trim)
      // Split selectors and replacement selectors into an array.
      .map(function (currentValue) { return currentValue.split(' as ')
        .map(Function.prototype.call, String.prototype.trim); });
  }
  return { url: cleanUrl, selectorFilters: selectorFilters };
};

/**
 * Extract and replace selectors from a file with the given url.
 * @param {string} cleanUrl - Cleaned up import url from node-sass.
 * @param {Object} selectorFilters - Selector filter object.
 * @return {string} Contents string or null.
 */
SelectorImporter.prototype.extractSelectors = function extractSelectors (cleanUrl, selectorFilters) {
  var selectors = [];
  var replacementSelectors = {};
  var contents = null;

  if (!selectorFilters) {
    return contents;
  }

  selectorFilters.forEach(function (selectorFilter) {
    var selector = selectorFilter[0];
    var replacementSelector = selectorFilter[1];
    selectors.push(selector);
    if (replacementSelector) {
      replacementSelectors[selector] = replacementSelector;
    }
  });

  this.options.includePaths.some(function (includePath) {
    var css = fs.readFileSync(path.join(includePath, cleanUrl), { encoding: 'utf8' });
    if (css) {
      contents = cssSelectorExtract.processSync(css, selectors, replacementSelectors);
      return true;
    }
    return false;
  });

  return contents;
};

/**
 * Synchronously resolve filtered contentes from a file with the given url.
 * @param {string} url - Import url from node-sass.
 * @return {string} Contents string or null.
 */
SelectorImporter.prototype.resolveSync = function resolveSync (url) {
  var data = this.parseUrl(url);
  var cleanUrl = data.url;
  var selectorFilters = data.selectorFilters;

  return this.extractSelectors(cleanUrl, selectorFilters);
};

/**
 * Asynchronously resolve filtered contentes from a file with the given url.
 * @param {string} url - Import url from node-sass.
 * @return {Promise} Promise for a contents string.
 */
SelectorImporter.prototype.resolve = function resolve (url) {
    var this$1 = this;

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url));
  });
};

var selectorImporter = new SelectorImporter();
function index (url, prev, done) {
  // Create an array of include paths to search for files.
  var includePaths = [];
  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev));
  }
  selectorImporter.options.includePaths = includePaths
    .concat(this.options.includePaths.split(path.delimiter));

  // Merge default with custom options.
  if (this.options.selectorImporter) {
    Object.assign(selectorImporter.options, this.options.selectorImporter);
  }
  selectorImporter.resolve(url, prev).then(function (contents) { return done(contents ? { contents: contents } : null); });
}

module.exports = index;