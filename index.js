/**
 * node-sass-magic-importer
 */
'use strict';

const findup = require('findup-sync');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const postcss = require('postcss');
const postcssScss = require('postcss-scss');

// Keep track of imported files.
const importedMap = new Map();

// Default options.
const defaultOptions = {
  importOnce: true,
  cssImport: true,
  extensions: ['.scss']
};

// Current working directory.
let cwd;

// Find selectors in the import url and
// return a cleaned up url and the selectors.
const parseUrl = (url) => {
  let cleanUrl = url;
  let selectorFilters;
  let selectorFiltersMatch = url.match(/{([^}]+)}/);
  if (selectorFiltersMatch) {
    cleanUrl = url.split(' from ')[1].trim();
    selectorFilters = selectorFiltersMatch[1].split(',').map(Function.prototype.call, String.prototype.trim);
  }
  return { cleanUrl, selectorFilters };
};

// Normalizes an import url for storage.
const normalizeUrl = (url) => {
  // Normalize a path, taking care of '..' and '.' parts.
  url = path.normalize(url);
  const parsed = path.parse(url);
  // Rremove the file extension.
  url = url.slice(0, url.length - parsed.ext.length);
  return url;
};

// Find the absolute path for a given url.
const getAbsoluteUrl = (url) => {
  let absoluteUrl = url;
  if (!path.isAbsolute(url)) {
    absoluteUrl = path.join(cwd, url);
  }
  return normalizeUrl(absoluteUrl);
};

// Return possible import url variations.
const getUrlVariants = (url) => {
  const parsed = path.parse(url);
  const urlVariants = [url];
  if (!parsed.ext) {
    // Add import url variations with all
    // possible extensions and partial prefix.
    defaultOptions.extensions.forEach((extension) => {
      urlVariants.push(`${parsed.dir}/${parsed.base}${extension}`);
      urlVariants.push(`${parsed.dir}/_${parsed.base}${extension}`);
    });
  }
  return urlVariants;
};

module.exports = function(url, prev, done) {
  // Set the current working directory.
  cwd = this.options.includePaths;
  if (path.isAbsolute(prev)) {
    cwd = path.dirname(prev);
  }

  // Add ".css" to the allowed extensions if CSS import is enabled.+
  if (defaultOptions.cssImport) {
    defaultOptions.extensions.push('.css');
  }

  // Keep track of imported files per "session".
  if (!importedMap.has(this.options.importer)) {
    importedMap.set(this.options.importer, new Set());
  }
  const importedSet = importedMap.get(this.options.importer);

  // Get a clean url (without selector filters) and
  // the selector filters from the import url.
  let { cleanUrl, selectorFilters } = parseUrl(url);

  // Find the path to the file and
  // search for matching files inside the "node_modules" directory.
  const urlVariants = getUrlVariants(cleanUrl);
  let filePath;
  urlVariants.forEach((variantUrl) => {
    let searchPath = findup(variantUrl, { cwd: cwd });
    if (searchPath) {
      filePath = searchPath;
      return;
    }
    // Look for matching files inside the node_modules directory.
    searchPath = findup(variantUrl, { cwd: './node_modules', nocase: true });
    if (searchPath) {
      filePath = cleanUrl = searchPath;
      return;
    }
  });

  // Extract selectors from the imported file and
  // only import the given selectors.
  if (selectorFilters && filePath) {
    let whiteListedSelectors = selectorFilters;
    let replacementSelectors = {};

    whiteListedSelectors.map((currentValue, index) => {
      const selectorAndReplacement = currentValue.split(' as ');
      if (selectorAndReplacement[1]) {
        whiteListedSelectors[index] = selectorAndReplacement[0].trim();
        replacementSelectors[index] = selectorAndReplacement[1].trim();
      }
    });

    let contents = fs.readFileSync(filePath);
    contents = postcss(postcss.plugin('postcss-extract-selectors', (options) => {
      return (css) => {
        css.walkRules((rule) => {
          // Findout if the current rule has an whitelisted selector.
          let whiteListSelectorIndex = false;
          whiteListedSelectors.forEach((selector, index) => {
            let selectorArray = rule.selector.split(',');
            if (selectorArray.indexOf(selector) !== -1) {
              // The index of the whitelisted selector is saved so we can
              // replace the selector with a given replacement selector
              whiteListSelectorIndex = index;
              return;
            }
          });
          if (whiteListSelectorIndex === false) {
            // Remove the selector.
            rule.remove();
          } else if (replacementSelectors[whiteListSelectorIndex]) {
            // Change the selector to match the given replacement selector.
            rule.selector = replacementSelectors[whiteListSelectorIndex];
          }
        });
      };
    })).process(contents, { syntax: postcssScss }).css;

    return {
      contents: contents
    };
  }

  // Import files if they have no "*" in the URL and add
  // the path to the map of already imported paths.
  if (!glob.hasMagic(cleanUrl)) {
    let absoluteUrl = getAbsoluteUrl(cleanUrl);
    // The file is already imported.
    if (defaultOptions.importOnce && importedSet.has(absoluteUrl)) {
      return {
        contents: "\n"
      };
    }
    importedSet.add(absoluteUrl);

    return {
      file: cleanUrl
    };
  }

  glob(cleanUrl, {cwd: cwd}, (err, files) => {
    if (err) {
      return console.error(err);
    }

    const imports = [];
    for (const file of files) {
      const parsedFile = path.parse(file);
      // Skip files which do not match the given extensions.
      if (defaultOptions.extensions.indexOf(parsedFile.ext) === -1) {
        continue;
      }

      let absoluteUrl = getAbsoluteUrl(file);
      const escaped = absoluteUrl.replace(/\\/g, "\\\\");
      imports.push(`@import "${escaped}";${this.options.linefeed}`);
    }

    // Add the @import statements with files found via the
    // glob pattern, to the contents so they are imported as usual.
    done({
      contents: imports.join("\n")
    });
  });
};
