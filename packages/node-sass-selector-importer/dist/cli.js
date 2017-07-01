'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var cssSelectorExtract = _interopDefault(require('css-selector-extract'));
var fs = _interopDefault(require('fs'));
var postcssScss = _interopDefault(require('postcss-scss'));

/**
 * Import only certain CSS selectors form a file.
 */
var SelectorImporter = function SelectorImporter(options) {
  if ( options === void 0 ) options = {};

  var defaultOptions = {
    includePaths: [process.cwd()]
  };
  /** @type {Object} */
  this.options = Object.assign({}, defaultOptions, options);
};

/**
 * Parse a url for selector filters.
 * @param {string} url - Import url from node-sass.
 * @return {Object} Cleaned up url and selector filter array.
 */
SelectorImporter.prototype.parseUrl = function parseUrl (url) {
    var this$1 = this;

  // Find selectors in the import url and
  // return a cleaned up url and the selectors.
  var cleanUrl = url;
  var selectorFilters;
  var selectorFiltersMatch = url.match(/{([\s\S]*)}/);
  if (selectorFiltersMatch) {
    cleanUrl = url.replace(/(\r\n|\n|\r)/gm, " ").split(" from ")[1].trim();
    // Create an array with selectors and replacement as one value.
    selectorFilters = selectorFiltersMatch[1].split(",")
      // Split selectors and replacement selectors into an array.
      .map(function (filter) {
        var filterArray = filter.trim().split(" as ")
          .map(Function.prototype.call, String.prototype.trim);

        var selector = filterArray[0];
        var replacement = this$1.escapeSpecialCharacters(filterArray[1]);

        var matchRegExpSelector = /^\/(.+)\/([a-z]*)$/.exec(selector);
        if (matchRegExpSelector) {
          var pattern = this$1.escapeSpecialCharacters(matchRegExpSelector[1], "\\\\");
          var flags = matchRegExpSelector[2];
          selector = new RegExp(pattern, flags);
        } else {
          selector = this$1.escapeSpecialCharacters(selector);
        }

        return {
          selector: selector,
          replacement: replacement
        };
      });
  }
  return { url: cleanUrl, selectorFilters: selectorFilters };
};

/**
 * Extract and replace selectors from a file with the given url.
 * @param {string} cleanUrl - Cleaned up import url from node-sass.
 * @param {Array} selectorFilters - Selector filter array.
 * @return {string} Contents string or null.
 */
SelectorImporter.prototype.extractSelectors = function extractSelectors (cleanUrl, selectorFilters) {
  var contents = null;

  if (!selectorFilters) {
    return contents;
  }

  this.options.includePaths.some(function (includePath) {
    try {
      var css = fs.readFileSync(path.resolve(includePath, cleanUrl), { encoding: "utf8" });
      if (css) {
        contents = cssSelectorExtract.processSync(css, selectorFilters, postcssScss);
        return true;
      }
    } catch (error) {}
    return false;
  });

  return contents;
};

/**
   * Escape special characters.
 * @param {string} string - String to be escaped.
 * @param {string} escapeSequence - The characters which should be used for escaping.
 * @return {string} String with escaped special characters.
 */
SelectorImporter.prototype.escapeSpecialCharacters = function escapeSpecialCharacters (string, escapeSequence) {
    if ( escapeSequence === void 0 ) escapeSequence = "\\";

  if (!string) { return string; }

  var specialCharacters = [
    "@"
  ];
  var regexSpecialCharacters = [
    "/"
  ];
  var regex = new RegExp(
    ("(?!@mixin)(" + (specialCharacters.join("|")) + "|\\" + (regexSpecialCharacters.join("|\\")) + ")"), "g"
  );
  return string.replace(regex, (escapeSequence + "$1"));
};

/**
 * Synchronously resolve filtered contents from a file with the given url.
 * @param {string} url - Import url from node-sass.
 * @return {Object|null} Contents object or null.
 */
SelectorImporter.prototype.resolveSync = function resolveSync (url) {
  var data = this.parseUrl(url);
  var cleanUrl = data.url;
  var selectorFilters = data.selectorFilters;
  var contents = this.extractSelectors(cleanUrl, selectorFilters);

  return contents ? { contents: contents } : null;
};

/**
 * Asynchronously resolve filtered contents from a file with the given url.
 * @param {string} url - Import url from node-sass.
 * @return {Promise} Promise for a contents object.
 */
SelectorImporter.prototype.resolve = function resolve (url) {
    var this$1 = this;

  return new Promise(function (promiseResolve) {
    promiseResolve(this$1.resolveSync(url));
  });
};

var selectorImporter = new SelectorImporter();

/**
 * Selector importer for node-sass
 * @param {string} url - The path in import as-is, which LibSass encountered.
 * @param {string} prev - The previously resolved path.
 */
var cli = function (url, prev) {
  // Create an array of include paths to search for files.
  var includePaths = [];
  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev));
  }
  selectorImporter.options.includePaths = includePaths
    .concat(this.options.includePaths.split(path.delimiter));

  return selectorImporter.resolveSync(url);
};

module.exports = cli;
