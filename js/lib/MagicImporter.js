import GlobImporter from 'node-sass-glob-importer/dist/GlobImporter.js';
import SelectorImporter from 'node-sass-selector-importer/dist/SelectorImporter.js';
import PackageImporter from 'node-sass-package-importer/dist/PackageImporter.js';

export default class MagicImporter {
  /**
   * DESCRIPTION
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
    const defaultOptions = {
      includePaths: [process.cwd()]
    };
    this.options = Object.assign({}, defaultOptions, options);
  }

  /**
   * Synchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {string} Fully resolved import url or null.
   */
  resolveSync(url) {
    const data = null;

    // Try to resolve glob pattern url.
    const globImporter = new GlobImporter();
    const globFiles = globImporter.resolveSync(url, this.options.includePaths);
    if (globFiles) {
      return { contents: globFiles.map(x => `@import '${x}';`).join('\n') };
    }

    return data;
  }

  /**
   * Asynchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for a fully resolved import url.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
