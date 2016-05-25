'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const findup = require('findup-sync');

// Hack to keep track of "sessions".
let usedMap = new Map();

// Normalizes an import path for storage.
let normalize = (url) => {
  url = path.normalize(url);
  let parsed = path.parse(url);
  url = url.slice(0, url.length - parsed.ext.length);

  return url;
};

module.exports = function(url, prev, done) {
  // We try to preserve imports within a Sass "session".
  if (!usedMap.has(this.options.importer)) {
    usedMap.set(this.options.importer, new Set());
  }

  let usedSet = usedMap.get(this.options.importer);
  let cwd = this.options.includePaths;

  if (path.isAbsolute(prev)) {
    cwd = path.dirname(prev);
  }

  let urlArray = url.split('/');
  let fileName = urlArray.pop();
  let urlVariants = [
    url,
    urlArray.join('/') + '/' + fileName + '.scss',
    urlArray.join('/') + '/_' + fileName + '.scss'
  ];
// console.log(urlArray);
// console.log(fileName);
  let modulePath;

  urlVariants.forEach(function (variantUrl) {
    modulePath = findup(variantUrl, { cwd: './node_modules', nocase: true });

    if (modulePath) {
      url = modulePath;
      return;
    }
console.log(variantUrl);
  });
//console.log(modulePath);
//fs.existsSync(prev)
  if (!glob.hasMagic(url)) {
    let fullPath = url;
    if (!path.isAbsolute(url)) {
      fullPath = path.join(cwd, url);
    }

    fullPath = normalize(fullPath);

    // We've already imported this! Yuck!
    // TODO: add "!multiple" suffix to force import
    if (usedSet.has(fullPath)) {
      return {
        contents: "\n"
      };
    }

    usedSet.add(fullPath);

    return {
      file: url
    };
  }

  glob(url, {cwd: cwd}, (err, files) => {
    if (err) {
      return console.error(err);
    }

    let imports = [];

    for (let file of files) {
      // Sass and SCSS syntax, though only SCSS is tested.
      if (!/\.s[ac]ss$/.test(file)) {
        continue;
      }

      let fullPath = file;
      if (!path.isAbsolute(file)) {
        fullPath = path.join(cwd, file);
      }

      fullPath = normalize(fullPath);

      let escaped = fullPath.replace(/\\/g, "\\\\");

      imports.push(`@import "${escaped}";${this.options.linefeed}`);
    }

    // Wrap it all up!
    done({
      contents: imports.join("\n")
    });
  });
};
