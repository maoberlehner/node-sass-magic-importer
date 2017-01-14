// @TODO: Add README info about filter importing and disableWarnings option.

import CssNodeExtract from 'css-node-extract';
import fs from 'fs';
import path from 'path';
import postcssSyntax from 'postcss-scss';

import cleanImportUrl from 'node-sass-filter-importer/dist/lib/clean-import-url';
import extractImportFilters from 'node-sass-filter-importer/dist/lib/extract-import-filters';

import FilterImporter from 'node-sass-filter-importer/dist/lib/filter-importer';
import GlobImporter from 'node-sass-glob-importer/dist/GlobImporter';
import PackageImporter from 'node-sass-package-importer/dist/PackageImporter';
import SelectorImporter from 'node-sass-selector-importer/dist/SelectorImporter';

/**
 * Selector specific imports, module importing,
 * globbing support, import files only once.
 */
export default class MagicImporter {
  /**
   * @param {Object} options - Configuration options.
   */
  constructor(options = {}) {
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
    /** @type {Object} */
    this.options = Object.assign({}, defaultOptions, options);
    /** @type {Array} */
    this.store = [];
  }

  /**
   * Find the absolute URL for a given relative URL.
   * @param {string} url - Import url from node-sass.
   * @return {string} Absolute import url.
   */
  getAbsoluteUrl(url) {
    let absoluteUrl = url;
    if (!path.isAbsolute(url)) {
      this.options.includePaths.some((includePath) => {
        try {
          absoluteUrl = path.normalize(path.join(includePath, absoluteUrl));
          return fs.statSync(absoluteUrl).isFile();
        } catch (e) {} // eslint-disable-line no-empty
        return false;
      });
    }
    return absoluteUrl;
  }

  /**
   * Add an URL to the store of imported URLs.
   *
   * @param {String} cleanUrl
   *   Cleaned up import url from node-sass.
   */
  storeAdd(cleanUrl) {
    const absoluteUrl = this.getAbsoluteUrl(cleanUrl);
    if (!this.store.includes(absoluteUrl)) this.store.push(absoluteUrl);
  }

  /**
   * Check if an URL is in store, add it if is not and it has no filters.
   *
   * @param {String} cleanUrl
   *   Cleaned up import url from node-sass.
   * @param {Boolean} hasFilters
   *   Does the URL have filters or not.
   * @return {boolean}
   *   Returns true if the URL has no filters and is already stored.
   */
  isInStore(cleanUrl, hasFilters = false) {
    const absoluteUrl = this.getAbsoluteUrl(cleanUrl);

    if (!hasFilters && this.store.includes(absoluteUrl)) return true;

    if (hasFilters && this.store.includes(absoluteUrl)) {
      if (!this.options.disableWarnings) {
        // eslint-disable-next-line no-console
        console.warn(`Warning: double import of file "${absoluteUrl}".`);
      }
      return false;
    }

    if (!hasFilters) this.storeAdd(cleanUrl);

    return false;
  }

  /**
   * Synchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {string} Importer object or null.
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
        this.storeAdd(globUrl, hasFilters);
        return fs.readFileSync(globUrl, { encoding: `utf8` });
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
    if (this.isInStore(resolvedUrl, hasFilters)) {
      return {
        file: ``,
        contents: ``,
      };
    }

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
   * @param {string} url - Import url from node-sass.
   * @return {Promise} Promise for importer object or null.
   */
  resolve(url) {
    return new Promise((promiseResolve) => {
      promiseResolve(this.resolveSync(url));
    });
  }
}
