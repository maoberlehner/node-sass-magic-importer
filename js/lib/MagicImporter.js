import GlobImporter from 'node-sass-glob-importer/dist/GlobImporter.js';
import PackageImporter from 'node-sass-package-importer/dist/PackageImporter.js';
import SelectorImporter from 'node-sass-selector-importer/dist/SelectorImporter.js';

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
    let data = null;
    let resolvedUrl = url;

    // Try to resolve glob pattern url.
    const globImporter = new GlobImporter();
    const globFiles = globImporter.resolveSync(url, this.options.includePaths);
    if (globFiles) {
      return { contents: globFiles.map(x => `@import '${x}';`).join('\n') };
    }

    // Parse url to eventually extract selector filters.
    const selectorImporter = new SelectorImporter();
    selectorImporter.options.includePaths = this.options.includePaths;
    const urlData = selectorImporter.parseUrl(resolvedUrl);
    const selectorFilters = urlData.selectorFilters;
    resolvedUrl = urlData.url;

    // Try to resolve a module url.
    const packageImporter = new PackageImporter();
    const packageFile = packageImporter.resolveSync(resolvedUrl);
    if (packageFile) {
      resolvedUrl = packageFile;
      data = { file: resolvedUrl };
    }

    // Filter selectors.
    const filteredContents = selectorImporter.extractSelectors(resolvedUrl, selectorFilters);
    if (filteredContents) {
      data = { contents: filteredContents };
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
