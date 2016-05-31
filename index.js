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

// Find selectors in the import url and
// return a cleaned up url and the selectors.
const parseUrl = (url) => {
  let cleanUrl = url;
  let selectorFilters;
  const selectorFiltersMatch = url.match(/{([^}]+)}/);
  let prioritizeModules = false;
  if (selectorFiltersMatch) {
    cleanUrl = url.split(' from ')[1].trim();
    // Create an array with selectors and replacement as one value.
    selectorFilters = selectorFiltersMatch[1].split(',');
    // Trim unnecessary whitespace.
    selectorFilters = selectorFilters.map(Function.prototype.call, String.prototype.trim);
    // Split selectors and replacement selectors into an array.
    selectorFilters = selectorFilters.map((currentValue, index) => {
      return currentValue.split(' as ').map(Function.prototype.call, String.prototype.trim);
    });
  }
  if (cleanUrl.charAt(0) == '~') {
    cleanUrl = cleanUrl.slice(1);
    prioritizeModules = true;
  }
  return { cleanUrl, selectorFilters, prioritizeModules };
};

// Find the absolute path for a given url.
const getAbsoluteUrl = (url, includePath) => {
  let absoluteUrl = url;
  if (!path.isAbsolute(url)) {
    absoluteUrl = path.join(includePath, url);
  }
  // Normalize a path, taking care of '..' and '.' parts.
  absoluteUrl = path.normalize(absoluteUrl);
  return absoluteUrl;
};

// Create possible variants of file paths
// with enabled extensions and partial prefix.
const getFilePathVariants = (filePath) => {
  const filePathVariants = [];
  const parsedFilePath = path.parse(filePath);
  if (parsedFilePath.ext) {
    filePathVariants.push(filePath);
  } else {
    defaultOptions.extensions.forEach((extension) => {
      filePathVariants.push(`${path.join(parsedFilePath.dir, parsedFilePath.base)}${extension}`);
      filePathVariants.push(`${path.join(parsedFilePath.dir, '_' + parsedFilePath.base)}${extension}`);
    });
  }
  return filePathVariants;
};

const getFilePath = (url, includePaths) => {
  let absoluteFilePath;
  let filePathVariants;
  let filePath = false;
  includePaths.some((includePath) => {
    absoluteFilePath = getAbsoluteUrl(url, includePath);
    filePathVariants = getFilePathVariants(absoluteFilePath);
    return filePathVariants.some((filePathVariant) => {
      if (fs.existsSync(filePathVariant)) {
        filePath = filePathVariant;
        return true;
      }
    });
  });
  return filePath;
};

const getModuleFilePath = (url) => {
// @TODO: Find main file
// @TODO: Find style file
  let searchPath = false;
  let filePath = false;
  // Search for the index file if only the module name is given.
  if (!path.parse(url).dir) {
    url = path.join(url, 'index');
  }
  const filePathVariants = getFilePathVariants(url);
  filePathVariants.some((filePathVariant) => {
    searchPath = findup(filePathVariant, { cwd: './node_modules' });
    if (searchPath) {
      filePath = searchPath;
      return true;
    }
  });
  return filePath;
};

const processSelectorFilters = (contents, selectorFilters) => {
  return postcss(postcss.plugin('postcss-extract-selectors', (options) => {
    return (css) => {
      css.walkRules((rule) => {
        let removeRule = false;
        // Findout if the current rule has an whitelisted selector.
        selectorFilters.some((selectorFilter) => {
          removeRule = false
          let searchSelector = selectorFilter[0];
          let replacementSelector = selectorFilter[1];
          let selectorArray = rule.selector.split(',');
          let matchingSelectorIndex = selectorArray.indexOf(searchSelector);
          // Check if there is a matching selector in the current rule.
          if (matchingSelectorIndex > -1) {
            if (replacementSelector) {
              // Change the selector to match the given replacement selector.
              selectorArray[matchingSelectorIndex] = replacementSelector;
              rule.selector = selectorArray.join(',');
            }
            // Stop search and do not remove the rule.
            return true;
          }
          // Current rule is not whitelisted, remove the rule.
          removeRule = true;
        });
        // Remove the rule.
        if (removeRule) {
          rule.remove();
        }
      });
    };
  })).process(contents, { syntax: postcssScss }).css;
};

module.exports = function(url, prev, done) {
console.time('benchmark');
  // Add ".css" to the allowed extensions if CSS import is enabled.
  if (defaultOptions.cssImport && defaultOptions.extensions.indexOf('.css') === -1) {
    defaultOptions.extensions.push('.css');
  }

  // Keep track of imported files.
  if (!importedMap.has(this.options.importer)) {
    importedMap.set(this.options.importer, new Set());
  }
  const importedSet = importedMap.get(this.options.importer);

  // Get a clean url (without selector filters) and
  // the selector filters from the import url.
  let { cleanUrl, selectorFilters, prioritizeModules } = parseUrl(url);

  // Create an array of all paths to search for files.
  let includePaths = [];
  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev));
  }
  includePaths = includePaths.concat(this.options.includePaths.split(path.delimiter));

  // Check if it is a glob url.
  if (glob.hasMagic(cleanUrl)) {
    const imports = [];
    let selectorFiltersString = '';
    if (selectorFilters) {
      selectorFiltersString = `{ ${selectorFilters.map((filter) => filter.join(' as ')).join(',')} } from `;
    }
    includePaths.some((includePath) => {
      let files = glob.sync(cleanUrl, {cwd: includePath});
      files.forEach((file) => {
        imports.push(`@import "${selectorFiltersString}${prioritizeModules ? '~' : ''}${path.join(includePath, file)}";`);
      });
      if (files.length) {
        return true;
      }
    });
    return {
      contents: imports.join(this.options.linefeed)
    };
  }

  // Find the absolute file path.
  let filePath;
  if (prioritizeModules) {
    filePath = getModuleFilePath(cleanUrl) || getFilePath(cleanUrl, includePaths);
  } else {
    filePath = getFilePath(cleanUrl, includePaths) || getModuleFilePath(cleanUrl);
  }

  // Check if the file is already imported.
  if (defaultOptions.importOnce && (importedSet.has(filePath) || importedSet.has(cleanUrl))) {
    return {
      contents: "\n"
    };
  }

  // If the importer can not find the file,
  // we return the url and wish node-sass more luck.
  if (!filePath) {
    // Add the url to the imported urls.
    importedSet.add(cleanUrl);
console.timeEnd('benchmark');
    return {
      file: cleanUrl
    };
  }

  // Use the file path as url.
  cleanUrl = filePath;

  // Add the url to the imported urls.
  importedSet.add(cleanUrl);

  // Load the file contents if the file has a .css ending
  // or selectors were found.
  if (selectorFilters || (defaultOptions.cssImport && path.parse(cleanUrl).ext == '.css')) {
    let contents = fs.readFileSync(cleanUrl).toString();
    // Filter and (optionally) replace selectors.
    if (selectorFilters) {
      contents = processSelectorFilters(contents, selectorFilters);
    }
console.timeEnd('benchmark');
    return {
      contents: contents
    };
  }
console.timeEnd('benchmark');
  return {
    file: cleanUrl
  };
};
