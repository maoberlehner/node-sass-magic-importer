// TODO: Refactor.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cssSelectorExtract = require("css-selector-extract");
const fs = require("fs");
const postcssScss = require("postcss-scss");
const clean_import_url_1 = require("../functions/clean-import-url");
const parse_selector_filters_1 = require("../functions/parse-selector-filters");
const resolve_url_1 = require("../functions/resolve-url");
class SelectorImporter {
    constructor({ cleanImportUrl, cssSelectorExtract, fs, parseSelectorFilters, postcssScss, resolveUrl, }) {
        this.cleanImportUrl = cleanImportUrl;
        this.cssSelectorExtract = cssSelectorExtract;
        this.fs = fs;
        this.parseSelectorFilters = parseSelectorFilters;
        this.postcssScss = postcssScss;
        this.resolveUrl = resolveUrl;
    }
    import(url, includePaths = []) {
        const selectorFilters = this.parseSelectorFilters(url);
        if (selectorFilters.length === 0) {
            return null;
        }
        const cleanedUrl = this.cleanImportUrl(url);
        const resolvedUrl = this.resolveUrl(cleanedUrl, includePaths);
        const contents = this.extractSelectors(resolvedUrl, selectorFilters);
        return contents ? { contents } : null;
    }
    extractSelectors(resolvedUrl, selectorFilters) {
        const css = this.fs.readFileSync(resolvedUrl, { encoding: `utf8` });
        return this.cssSelectorExtract.processSync(css, selectorFilters, this.postcssScss);
    }
}
exports.SelectorImporter = SelectorImporter;
function selectorImporterFactory() {
    return new SelectorImporter({
        cleanImportUrl: clean_import_url_1.default,
        cssSelectorExtract,
        fs,
        parseSelectorFilters: parse_selector_filters_1.default,
        postcssScss,
        resolveUrl: resolve_url_1.default,
    });
}
exports.selectorImporterFactory = selectorImporterFactory;
//# sourceMappingURL=SelectorImporter.js.map