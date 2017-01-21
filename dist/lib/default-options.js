'use strict';

/**
 * Default options.
 *
 * @type {Object}
 */
var defaultOptions = {
  cwd: process.cwd(),
  includePaths: [process.cwd()],
  extensions: [".scss", ".sass"],
  packageKeys: ["sass", "scss", "style", "css", "main.sass", "main.scss", "main.style", "main.css", "main"],
  prefix: "~",
  disableWarnings: false,
  disableImportOnce: false
};

module.exports = defaultOptions;
