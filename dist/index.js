'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cssSelectorExtract = _interopDefault(require('css-selector-extract'));
var findup = _interopDefault(require('findup-sync'));
var fs = _interopDefault(require('fs'));
var glob = _interopDefault(require('glob'));
var path = _interopDefault(require('path'));

// Keep track of imported files.
var importedMap = new Map();

// Options.
var defaultOptions = {
  importOnce: true,
  cssImport: true,
  extensions: ['.scss']
};
var options = {};

// Find selectors in the import url and
// return a cleaned up url and the selectors.
var parseUrl = function (url) {
  var cleanUrl = url;
  var selectorFilters;
  var selectorFiltersMatch = url.match(/{([^}]+)}/);
  var prioritizeModules = false;
  if (selectorFiltersMatch) {
    cleanUrl = url.replace(/(\r\n|\n|\r)/gm, ' ').split(' from ')[1].trim();
    // Create an array with selectors and replacement as one value.
    selectorFilters = selectorFiltersMatch[1].split(',');
    // Trim unnecessary whitespace.
    selectorFilters = selectorFilters.map(Function.prototype.call, String.prototype.trim);
    // Split selectors and replacement selectors into an array.
    selectorFilters = selectorFilters.map(function (currentValue, index) {
      return currentValue.split(' as ').map(Function.prototype.call, String.prototype.trim);
    });
  }
  if (cleanUrl.charAt(0) == '~') {
    cleanUrl = cleanUrl.slice(1);
    prioritizeModules = true;
  }
  return { cleanUrl: cleanUrl, selectorFilters: selectorFilters, prioritizeModules: prioritizeModules };
};

// Find the absolute path for a given url.
var getAbsoluteUrl = function (url, includePath) {
  var absoluteUrl = url;
  if (!path.isAbsolute(url)) {
    absoluteUrl = path.join(includePath, url);
  }
  // Normalize a path, taking care of '..' and '.' parts.
  absoluteUrl = path.normalize(absoluteUrl);
  return absoluteUrl;
};

// Create possible variants of file paths
// with enabled extensions and partial prefix.
var getFilePathVariants = function (filePath) {
  var filePathVariants = [];
  var parsedFilePath = path.parse(filePath);
  if (parsedFilePath.ext) {
    filePathVariants.push(filePath);
  } else {
    options.extensions.forEach(function (extension) {
      filePathVariants.push(("" + (path.join(parsedFilePath.dir, parsedFilePath.base)) + extension));
      filePathVariants.push(("" + (path.join(parsedFilePath.dir, '_' + parsedFilePath.base)) + extension));
    });
  }
  return filePathVariants;
};

var getFilePath = function (url, includePaths) {
  var absoluteFilePath;
  var filePathVariants;
  var filePath = false;
  includePaths.some(function (includePath) {
    absoluteFilePath = getAbsoluteUrl(url, includePath);
    filePathVariants = getFilePathVariants(absoluteFilePath);
    return filePathVariants.some(function (filePathVariant) {
      if (fs.existsSync(filePathVariant)) {
        filePath = filePathVariant;
        return true;
      }
    });
  });
  return filePath;
};

var getModuleFilePath = function (url) {
  var searchPath = false;
  var filePath = false;
  // If only the module name is given, we look in the modules package.json file
  // for "sass", "style" or "main" declarations.
  if (!path.parse(url).dir) {
    // Search the modules package.json file.
    var packageJsonUrl = path.join(url, 'package.json');
    var packageJsonPath = findup(packageJsonUrl, { cwd: 'node_modules' });
    var packageUrl;
    if (packageJsonPath) {
      var moduleDir = path.parse(packageJsonPath).dir;
      var packageJson = require(packageJsonPath);
      if (packageJson.sass) {
        packageUrl = path.join(moduleDir, packageJson.sass);
      } else if (packageJson.style) {
        packageUrl = path.join(moduleDir, packageJson.style);
      } else if (packageJson.main) {
        var mainFile = path.join(moduleDir, packageJson.main);
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
  var filePathVariants = getFilePathVariants(url);
  filePathVariants.some(function (filePathVariant) {
    searchPath = findup(filePathVariant, { cwd: 'node_modules' });
    if (searchPath) {
      filePath = searchPath;
      return true;
    }
  });
  return filePath;
};

module.exports = function(url, prev, done) {
  var customOptions = this.options.magicImporter || {};
  Object.assign(options, defaultOptions, customOptions);

  // Add ".css" to the allowed extensions if CSS import is enabled.
  if (options.cssImport && options.extensions.indexOf('.css') === -1) {
    options.extensions.push('.css');
  }

  // Keep track of imported files.
  if (!importedMap.has(this.options.importer)) {
    importedMap.set(this.options.importer, new Set());
  }
  var importedSet = importedMap.get(this.options.importer);

  // Get a clean url (without selector filters) and
  // the selector filters from the import url.
  var urlSettings = parseUrl(url);
  var cleanUrl = urlSettings.cleanUrl;
  var selectorFilters = urlSettings.selectorFilters;
  var prioritizeModules = urlSettings.prioritizeModules;

  // Create an array of all paths to search for files.
  var includePaths = [];
  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev));
  }
  includePaths = includePaths.concat(this.options.includePaths.split(path.delimiter));

  // Check if it is a glob url.
  if (glob.hasMagic(cleanUrl)) {
    var imports = [];
    var selectorFiltersString = '';
    if (selectorFilters) {
      selectorFiltersString = "{ " + (selectorFilters.map(function (filter) { return filter.join(' as '); }).join(',')) + " } from ";
    }
    includePaths.some(function (includePath) {
      var files = glob.sync(cleanUrl, {cwd: includePath});
      files.forEach(function (file) {
        imports.push(("@import \"" + selectorFiltersString + (prioritizeModules ? '~' : '') + (path.join(includePath, file)) + "\";"));
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
  var filePath;
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
    var contents = fs.readFileSync(cleanUrl).toString();
    // Filter and (optionally) replace selectors.
    if (selectorFilters) {
      var selectors = [];
      var replacementSelectors = {};
      selectorFilters.forEach(function (selectorArr) {
        selectors.push(selectorArr[0]);
        if (selectorArr[1]) {
          replacementSelectors[selectorArr[0]] = selectorArr[1];
        }
      });
      contents = cssSelectorExtract.processSync(contents, selectors, replacementSelectors);
    }
    return {
      contents: contents
    };
  }
  return {
    file: cleanUrl
  };
};