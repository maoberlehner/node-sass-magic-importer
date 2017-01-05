// @TODO: Add README info about filter importing.

import CssNodeExtract from 'css-node-extract';
import fs from 'fs';
import path from 'path';
import postcssSyntax from 'postcss-scss';
import uniqueConcat from 'unique-concat';

import FilterImporter from 'node-sass-filter-importer/dist/lib/FilterImporter.js';
import GlobImporter from 'node-sass-glob-importer/dist/GlobImporter.js';
import PackageImporter from 'node-sass-package-importer/dist/PackageImporter.js';
import SelectorImporter from 'node-sass-selector-importer/dist/SelectorImporter.js';

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
        `.sass`
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
        `main`
      ]
    };
    /** @type {Object} */
    this.options = Object.assign({}, defaultOptions, options);
    /** @type {Object} */
    this.onceStore = {};
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
        } catch (e) {}
        return false;
      });
    }
    return absoluteUrl;
  }

  /**
   * Store the given URL and selector filters
   * and determine if the URL should be imported.
   * @param {string} url - Import url from node-sass.
   * @param {Array} selectorFilters - CSS selectors and replacement selectors.
   * @return {boolean|Object} - Absolute URL and selector filters or false.
   */
  store(url, selectorFilters = null) {
    // @TODO: Add filter logic.
    const absoluteUrl = this.getAbsoluteUrl(url);

    // URL is not in store: store and load the URL.
    if (this.onceStore[absoluteUrl] === undefined) {
      this.onceStore[absoluteUrl] = selectorFilters;
      return { url: absoluteUrl, selectorFilters };
    }

    // URL is in store without filters, filters given: load the URL.
    if (this.onceStore[absoluteUrl] === null && selectorFilters) {
      // eslint-disable-next-line no-console
      console.warn(`Warning: double import of file "${url}"`);
      return { url: absoluteUrl, selectorFilters };
    }

    // URL and filters in store, URL without filters given:
    // load and remove filters from store.
    if (this.onceStore[absoluteUrl] && !selectorFilters) {
      // eslint-disable-next-line no-console
      console.warn(`Warning: double import of file "${url}"`);
      this.onceStore[absoluteUrl] = null;
      return { url: absoluteUrl, selectorFilters };
    }

    // URL and filters in store, URL with same and other filters given:
    // only load other filters that not already are stored.
    if (this.onceStore[absoluteUrl] && selectorFilters) {
      const concatSelectorFilters = uniqueConcat(
        this.onceStore[absoluteUrl],
        selectorFilters
      );
      // If stored and given selector filters are identically, do not load.
      if (JSON.stringify(concatSelectorFilters) !== JSON.stringify(this.onceStore[absoluteUrl])) {
        const selectorFiltersDiff = selectorFilters.filter(x =>
          !this.onceStore[absoluteUrl].some(y => JSON.stringify(x) === JSON.stringify(y))
        );
        this.onceStore[absoluteUrl] = concatSelectorFilters;
        return { url: absoluteUrl, selectorFilters: selectorFiltersDiff };
      }
    }
    return false;
  }

  /**
   * Synchronously resolve the path to a node-sass import url.
   * @param {string} url - Import url from node-sass.
   * @return {string} Importer object or null.
   */
  resolveSync(url) {
    let data = null;
    // @TODO: Ugly.
    let resolvedUrl = url.split(`from`)[1] || url;
    resolvedUrl = resolvedUrl.trim();

    // Parse url and eventually extract filters.
    const filterImporter = new FilterImporter(this.options);
    const filterNames = filterImporter.parseUrl(url).filterNames;

    // Parse url and eventually extract selector filters.
    const selectorImporter = new SelectorImporter(this.options);
    let selectorFilters = selectorImporter.parseUrl(url).selectorFilters;

    // Try to resolve glob pattern url.
    const globImporter = new GlobImporter(this.options);
    const globFiles = globImporter.resolveFilePathsSync(resolvedUrl);
    if (globFiles.length) {
      return { contents: globFiles.map(x => {
        this.store(x);
        return fs.readFileSync(x, { encoding: `utf8` });
      }).join(`\n`) };
    }

    // Try to resolve a module url.
    const packageImporter = new PackageImporter(this.options);
    const packageImportData = packageImporter.resolveSync(resolvedUrl);
    if (packageImportData) {
      resolvedUrl = packageImportData.file;
      data = { file: resolvedUrl };
    }

    const storedData = this.store(resolvedUrl, selectorFilters);

    // If the file is already stored and should not be loaded,
    // prevent node-sass from importing the file again.
    if (!storedData) {
      return {
        file: ``,
        contents: ``
      };
    }

    resolvedUrl = storedData.url;
    selectorFilters = storedData.selectorFilters;

    // Filter.
    let filteredContents;
    // @TODO: This is ugly, maybe refactor.
    if (selectorFilters) {
      filteredContents = selectorImporter.extractSelectors(resolvedUrl, selectorFilters);
    }
    if (filterNames) {
      if (filteredContents) {
        filteredContents = CssNodeExtract.processSync({
          css: filteredContents,
          filterNames,
          postcssSyntax
        });
      } else {
        filteredContents = filterImporter.extractFilters(resolvedUrl, filterNames);
      }
    }
    if (filteredContents) {
      data = {
        file: resolvedUrl,
        contents: filteredContents
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
