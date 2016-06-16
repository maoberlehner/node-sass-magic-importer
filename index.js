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

// Options.
const defaultOptions = {
  importOnce: true,
  cssImport: true,
  extensions: ['.scss']
};
let options = {};

// Find selectors in the import url and
// return a cleaned up url and the selectors.
const parseUrl = (url) => {
  let cleanUrl = url;
  let selectorFilters;
  const selectorFiltersMatch = url.match(/{([^}]+)}/);
  let prioritizeModules = false;
  if (selectorFiltersMatch) {
    cleanUrl = url.replace(/(\r\n|\n|\r)/gm, ' ').split(' from ')[1].trim();
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
    options.extensions.forEach((extension) => {
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
  let searchPath = false;
  let filePath = false;
  // If only the module name is given, we look in the modules package.json file
  // for "sass", "style" or "main" declarations.
  if (!path.parse(url).dir) {
    // Search the modules package.json file.
    const packageJsonUrl = path.join(url, 'package.json');
    const packageJsonPath = findup(packageJsonUrl, { cwd: 'node_modules' });
    let packageUrl;
    if (packageJsonPath) {
      const moduleDir = path.parse(packageJsonPath).dir;
      const packageJson = require(packageJsonPath);
      if (packageJson.sass) {
        packageUrl = path.join(moduleDir, packageJson.sass);
      } else if (packageJson.style) {
        packageUrl = path.join(moduleDir, packageJson.style);
      } else if (packageJson.main) {
        const mainFile = path.join(moduleDir, packageJson.main);
        // Only load the main file if the extensions matches allowed extensions.
        if (options.extensions.indexOf(path.parse(mainFile).ext) !== -1) {
          packageUrl = mainFile;
        }
      }
    }
    // If no matching file is found in the modules package.json we default to
    // a index file in the modules root directory.
    if (!packageUrl) {
      packageUrl = path.join(url, 'index');
    }
    url = packageUrl;
  }
  const filePathVariants = getFilePathVariants(url);
  filePathVariants.some((filePathVariant) => {
    searchPath = findup(filePathVariant, { cwd: 'node_modules' });
    if (searchPath) {
      filePath = searchPath;
      return true;
    }
  });
  return filePath;
};

const processSelectorFilters = (contents, selectorFilters) => {
  return postcss(postcss.plugin('postcss-extract-selectors', (options) => {
    const searchSelectorFilters = [];
    const replacementSelectorFilters = [];
    // Split the selector filters in tow arrays, one array with selectors to
    // search for and the other array with replacements for the filtered
    // selectors.
    selectorFilters.forEach((selectorFilter) => {
      let searchSelector = selectorFilter[0];
      let replacementSelector = selectorFilter[1];
      searchSelectorFilters.push(searchSelector);
      replacementSelectorFilters.push(replacementSelector || searchSelector);
    });

    return (css) => {
      css.walkRules((rule) => {
        // Split combined selectors into an array.
        let ruleSelectors = rule.selector.split(',').map((ruleSelector) => ruleSelector.replace(/(\r\n|\n|\r)/gm, '').trim());
        // Find whitelisted selectors and remove others.
        ruleSelectors.forEach((ruleSelector, index) => {
          let selectorFilterIndex = searchSelectorFilters.indexOf(ruleSelector);
          if (selectorFilterIndex != -1) {
            ruleSelectors[index] = replacementSelectorFilters[selectorFilterIndex];
          } else {
            // Set an empty value for the selector to mark it for deletion.
            ruleSelectors[index] = '';
          }
        });
        // Remove empty selectors.
        ruleSelectors = ruleSelectors.filter((ruleSelector) => ruleSelector.length > 0 || false);
        if (ruleSelectors.length) {
          rule.selector = ruleSelectors.join(',');
        } else {
          // Remove the rule.
          rule.remove();
        }
      });
    };
  })).process(contents, { syntax: postcssScss }).css;
};

module.exports = function(url, prev, done) {
  const customOptions = this.options.magicImporter || {};
  Object.assign(options, defaultOptions, customOptions);

  // Add ".css" to the allowed extensions if CSS import is enabled.
  if (options.cssImport && options.extensions.indexOf('.css') === -1) {
    options.extensions.push('.css');
  }

  // Keep track of imported files.
  if (!importedMap.has(this.options.importer)) {
    importedMap.set(this.options.importer, new Set());
  }
  const importedSet = importedMap.get(this.options.importer);

  // Get a clean url (without selector filters) and
  // the selector filters from the import url.
  const urlSettings = parseUrl(url);
  let cleanUrl = urlSettings.cleanUrl;
  const selectorFilters = urlSettings.selectorFilters;
  const prioritizeModules = urlSettings.prioritizeModules;

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
  if (options.importOnce && (importedSet.has(filePath) || importedSet.has(cleanUrl))) {
    return {
      file: '',
      contents: ''
    };
  }

  // If the importer can not find the file,
  // we return the url and wish node-sass more luck.
  if (!filePath) {
    // Add the url to the imported urls.
    importedSet.add(cleanUrl);
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
  if (selectorFilters || (options.cssImport && path.parse(cleanUrl).ext == '.css')) {
    let contents = fs.readFileSync(cleanUrl).toString();
    // Filter and (optionally) replace selectors.
    if (selectorFilters) {
      contents = processSelectorFilters(contents, selectorFilters);
    }
    return {
      contents: contents
    };
  }
  return {
    file: cleanUrl
  };
};
