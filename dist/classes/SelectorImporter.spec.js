// TODO: Test all the things.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const cssSelectorExtract = require("css-selector-extract");
const fs = require("fs");
const postcssScss = require("postcss-scss");
const clean_import_url_1 = require("../functions/clean-import-url");
const parse_selector_filters_1 = require("../functions/parse-selector-filters");
const resolve_url_1 = require("../functions/resolve-url");
const SelectorImporter_1 = require("./SelectorImporter");
ava_1.default.beforeEach((t) => {
    t.context.dependencies = {
        cleanImportUrl: clean_import_url_1.default,
        cssSelectorExtract,
        fs,
        parseSelectorFilters: parse_selector_filters_1.default,
        postcssScss,
        resolveUrl: resolve_url_1.default,
    };
});
ava_1.default(`Should be an object.`, (t) => {
    const selectorImporter = new SelectorImporter_1.SelectorImporter(t.context.dependencies);
    t.is(typeof selectorImporter, `object`);
});
//# sourceMappingURL=SelectorImporter.spec.js.map