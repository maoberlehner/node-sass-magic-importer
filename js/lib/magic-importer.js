import CssNodeExtract from 'css-node-extract';
import fs from 'fs';
import postcssSyntax from 'postcss-scss';

import cleanImportUrl from 'node-sass-filter-importer/dist/lib/clean-import-url';
import extractImportFilters from 'node-sass-filter-importer/dist/lib/extract-import-filters';

import FilterImporter from 'node-sass-filter-importer/dist/lib/filter-importer';
import GlobImporter from 'node-sass-glob-importer/dist/GlobImporter';
import PackageImporter from 'node-sass-package-importer/dist/PackageImporter';
import SelectorImporter from 'node-sass-selector-importer/dist/SelectorImporter';

import defaultOptions from './default-options';
import resolveUrl from './resolve-url';
import storeAdd from './store-add';
import storeHas from './store-has';

/**
 * Selector specific imports, filter imports, module importing,
 * globbing support and import files only once.
 */
export default class MagicImporter {
  /**
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
    /** @type {Object} */
    this.options = Object.assign({}, defaultOptions, options);
  }

  /**
   * Synchronously resolve the path to a node-sass import url.
   *
   * @param {String} url
   *   Import url from node-sass.
   * @return {String}
   *   Importer object or null.
   */
  resolveSync(url) {
    let data = null;
    let resolvedUrl = cleanImportUrl(url);

    // Parse url and eventually extract filters.
    const filterNames = extractImportFilters(url);

    // Parse url and eventually extract selector filters.
    const selectorImporter = new SelectorImporter(this.options);
    const selectorFilters = selectorImporter.parseUrl(url).selectorFilters || [];
    const hasFilters = filterNames.length || selectorFilters.length;

    // Try to resolve glob pattern url.
    const globImporter = new GlobImporter(this.options);
    const globFiles = globImporter.resolveFilePathsSync(resolvedUrl);
    if (globFiles.length) {
      return { contents: globFiles.map((globUrl) => {
        if (!storeHas(globUrl, hasFilters) || this.options.disableImportOnce) {
          if (!hasFilters) storeAdd(globUrl);
          return fs.readFileSync(globUrl, { encoding: `utf8` });
        }
        if (!hasFilters) storeAdd(globUrl);
        return ``;
      }).join(`\n`) };
    }

    // Try to resolve a module url.
    const packageImporter = new PackageImporter(this.options);
    const packageImportData = packageImporter.resolveSync(resolvedUrl);
    if (packageImportData) {
      resolvedUrl = packageImportData.file;
      data = { file: resolvedUrl };
    }

    // If the file is already stored and should not be loaded,
    // prevent node-sass from importing the file again.
    if (
      storeHas(resolveUrl(resolvedUrl, this.options.includePaths), hasFilters) &&
      !this.options.disableImportOnce
    ) {
      return {
        file: ``,
        contents: ``,
      };
    }

    if (!hasFilters) storeAdd(resolveUrl(resolvedUrl, this.options.includePaths));

    // Filter.
    let filteredContents;
    // @TODO: This is ugly, maybe refactor.
    if (selectorFilters.length) {
      filteredContents = selectorImporter.extractSelectors(resolvedUrl, selectorFilters);
    }
    if (filterNames.length) {
      if (filteredContents) {
        filteredContents = CssNodeExtract.processSync({
          css: filteredContents,
          filterNames,
          postcssSyntax,
        });
      } else {
        const filterImporter = new FilterImporter(this.options);
        filteredContents = filterImporter.extractFilters(resolvedUrl, filterNames);
      }
    }
    if (filteredContents) {
      data = {
        file: resolvedUrl,
        contents: filteredContents,
      };
    }

    return data;
  }

  /**
   * Asynchronously resolve the path to a node-sass import url.
   *
   * @param {string} url
   *   Import url from node-sass.
   * @return {Promise}
   *   Promise for importer object or null.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
