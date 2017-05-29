"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cssSelectorExtract = require("css-selector-extract");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const postcssScss = require("postcss-scss");
const clean_import_url_1 = require("./functions/clean-import-url");
const escape_selector_1 = require("./functions/escape-selector");
const extract_selectors_1 = require("./functions/extract-selectors");
const parse_selector_filters_1 = require("./functions/parse-selector-filters");
const process_raw_selector_filters_1 = require("./functions/process-raw-selector-filters");
const resolve_url_1 = require("./functions/resolve-url");
const sass_glob_pattern_1 = require("./functions/sass-glob-pattern");
const split_selector_filter_1 = require("./functions/split-selector-filter");
const cleanImportUrl = clean_import_url_1.cleanImportUrlFactory();
const sassGlobPattern = sass_glob_pattern_1.sassGlobPatternFactory(path);
const resolveUrl = resolve_url_1.resolveUrlFactory(glob, path, sassGlobPattern);
const escapeSelector = escape_selector_1.escapeSelectorFactory();
const extractSelectors = extract_selectors_1.extractSelectorsFactory(cssSelectorExtract, fs, postcssScss);
const processRawSelectorFilters = process_raw_selector_filters_1.processRawSelectorFiltersFactory(escapeSelector);
const splitSelectorFilter = split_selector_filter_1.splitSelectorFilterFactory();
const parseSelectorFilters = parse_selector_filters_1.parseSelectorFiltersFactory(processRawSelectorFilters, splitSelectorFilter);
function selectorImporter(options) {
    return function importer(url, prev) {
        // TODO: Refactor inlcude paths thing in function
        const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
        if (path.isAbsolute(prev)) {
            includePathsSet.add(path.dirname(prev));
        }
        const includePaths = [...includePathsSet];
        const selectorFilters = parseSelectorFilters(url);
        if (selectorFilters.length === 0) {
            return null;
        }
        const cleanedUrl = cleanImportUrl(url);
        const resolvedUrl = resolveUrl(cleanedUrl, includePaths);
        const contents = extractSelectors(resolvedUrl, selectorFilters);
        return contents ? { contents } : null;
    };
}
exports.default = selectorImporter;
//# sourceMappingURL=selector-importer.js.map