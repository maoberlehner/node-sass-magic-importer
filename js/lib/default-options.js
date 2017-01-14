/**
 * Default options.
 *
 * @type {Object}
 */
const defaultOptions = {
  cwd: process.cwd(),
  includePaths: [process.cwd()],
  extensions: [
    `.scss`,
    `.sass`,
  ],
  packageKeys: [
    `sass`,
    `scss`,
    `style`,
    `css`,
    `main.sass`,
    `main.scss`,
    `main.style`,
    `main.css`,
    `main`,
  ],
  disableWarnings: false,
};

export default defaultOptions;
