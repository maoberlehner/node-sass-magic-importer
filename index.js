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

// Possible file extensions.
const extensions = ['.scss', '.sass', '.css'];

// Normalizes an import path for storage.
const normalize = (url) => {
  // Normalize a path, taking care of '..' and '.' parts.
  url = path.normalize(url);
  const parsed = path.parse(url);
  // Rremove the file extension.
  url = url.slice(0, url.length - parsed.ext.length);
  return url;
};

const getFullPath = (fullPath, cwd) => {
  if (!path.isAbsolute(fullPath)) {
    fullPath = path.join(cwd, fullPath);
  }
  return normalize(fullPath);
};

// Return possible import url variations.
const getUrlVariants = (url) => {
  const parsed = path.parse(url);
  const urlVariants = [url];
  if (!parsed.ext) {
    // Add import url variations with all
    // possible extensions and partial prefix.
    extensions.forEach((extension) => {
      urlVariants.push(`${parsed.dir}/${parsed.base}${extension}`);
      urlVariants.push(`${parsed.dir}/_${parsed.base}${extension}`);
    });
  }
  return urlVariants;
};

module.exports = function(url, prev, done) {
  // Keep track of imported files per "session".
  if (!importedMap.has(this.options.importer)) {
    importedMap.set(this.options.importer, new Set());
  }

  const importedSet = importedMap.get(this.options.importer);
  let selectors = url.match(/{([^}]+)}/);
  let cwd = this.options.includePaths;

  if (path.isAbsolute(prev)) {
    cwd = path.dirname(prev);
  }

  if (selectors) {
    url = url.split(' from ')[1].trim();
  }

  const urlVariants = getUrlVariants(url);
  let filePath;
  let modulePath;

  urlVariants.forEach((variantUrl) => {
    filePath = findup(variantUrl, { cwd: cwd, nocase: true });
    if (filePath) {
      return;
    }
    // Look for matching files inside the node_modules directory.
    modulePath = findup(variantUrl, { cwd: './node_modules', nocase: true });
    if (modulePath) {
      url = modulePath;
      return;
    }
  });

  let whiteListedSelectors = [];
  let replacementSelectors = {};

  if (selectors) {
    selectors = selectors[1].split(',').map(Function.prototype.call, String.prototype.trim);
    selectors.map((currentValue, index) => {
      const selectorAndReplacement = currentValue.split(' as ');
      if (selectorAndReplacement[1]) {
        selectors[index] = selectorAndReplacement[0].trim();
        replacementSelectors[index] = selectorAndReplacement[1].trim();
      }
    });
    whiteListedSelectors = selectors;

    let scss = fs.readFileSync(filePath || url);
    scss = postcss(postcss.plugin('postcss-remover', (options) => {
      return (css) => {
        css.walkRules((rule) => {
          let whiteListSelectorIndex = false;
          whiteListedSelectors.forEach((selector, index) => {
            let selectorArray = rule.selector.split(',');
            if (selectorArray.indexOf(selector) !== -1) {
              whiteListSelectorIndex = index;
              return;
            }
          });
          if (whiteListSelectorIndex === false) {
            rule.remove();
          } else if (replacementSelectors[whiteListSelectorIndex]) {
            rule.selector = replacementSelectors[whiteListSelectorIndex];
          }
        });
      };
    })).process(scss, { syntax: postcssScss }).css;

    return {
      contents: scss
    };
  }

  // Import files if they have no "*" in the URL and add
  // the path to the map of already imported paths.
  if (!glob.hasMagic(url)) {
    let fullPath = getFullPath(url, cwd);
    // The file is already imported.
    if (importedSet.has(fullPath)) {
      return {
        contents: "\n"
      };
    }

    importedSet.add(fullPath);

    return {
      file: url
    };
  }

  glob(url, {cwd: cwd}, (err, files) => {
    if (err) {
      return console.error(err);
    }

    const imports = [];
    for (const file of files) {
      const parsedFile = path.parse(file);
      // Skip files that are not stylesheets.
      if (extensions.indexOf(parsedFile.ext) === -1) {
        continue;
      }

      let fullPath = getFullPath(file, cwd);
      const escaped = fullPath.replace(/\\/g, "\\\\");
      imports.push(`@import "${escaped}";${this.options.linefeed}`);
    }

    // Add the @import statements with files found via the
    // glob pattern, to the contents so they are imported as usual.
    done({
      contents: imports.join("\n")
    });
  });
};
