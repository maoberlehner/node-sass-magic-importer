// TODO: Test all the things.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const cssSelectorExtract = require("css-selector-extract");
const fs = require("fs");
const postcssScss = require("postcss-scss");
const sinon = require("sinon");
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
ava_1.default(`Should parse selector filters, clean and resolve the given URL and extract selectors.`, (t) => {
    const url = `test/url`;
    const includePaths = [`/`];
    const cleanImportUrlStub = sinon.stub().returns(`cleaned/url`);
    const cssSelectorExtractStub = { processSync: sinon.stub() };
    const fsStub = { readFileSync: sinon.stub().returns(`css`) };
    const parseSelectorFiltersStub = sinon.stub().returns([`selectorFilters`]);
    const resolveUrlStub = sinon.stub().returns(`resolved/url`);
    const dependencies = Object.assign(t.context.dependencies, {
        cleanImportUrl: cleanImportUrlStub,
        cssSelectorExtract: cssSelectorExtractStub,
        fs: fsStub,
        parseSelectorFilters: parseSelectorFiltersStub,
        resolveUrl: resolveUrlStub,
    });
    const selectorImporter = new SelectorImporter_1.SelectorImporter(dependencies);
    selectorImporter.import(url, includePaths);
    t.true(parseSelectorFiltersStub.calledWith(url));
    t.true(cleanImportUrlStub.calledWith(url));
    t.true(resolveUrlStub.calledWith(`cleaned/url`, includePaths));
    t.true(cssSelectorExtractStub.processSync.calledWith(`css`, [`selectorFilters`]));
});
//# sourceMappingURL=SelectorImporter.spec.js.map