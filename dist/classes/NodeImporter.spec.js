"use strict";
// TODO: Test all the things.
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const cssNodeExtract = require("css-node-extract");
const fs = require("fs");
const postcssScss = require("postcss-scss");
const sinon = require("sinon");
const clean_import_url_1 = require("../functions/clean-import-url");
const parse_node_filters_1 = require("../functions/parse-node-filters");
const resolve_url_1 = require("../functions/resolve-url");
const NodeImporter_1 = require("./NodeImporter");
ava_1.default.beforeEach((t) => {
    t.context.dependencies = {
        cleanImportUrl: clean_import_url_1.default,
        cssNodeExtract,
        fs,
        parseNodeFilters: parse_node_filters_1.default,
        postcssScss,
        resolveUrl: resolve_url_1.default,
    };
});
ava_1.default(`Should be an object.`, (t) => {
    const nodeImporter = new NodeImporter_1.NodeImporter(t.context.dependencies);
    t.is(typeof nodeImporter, `object`);
});
ava_1.default(`Should parse node filters, clean and resolve the given URL and extract nodes.`, (t) => {
    const url = `test/url`;
    const includePaths = [`/`];
    const cleanImportUrlStub = sinon.stub().returns(`cleaned/url`);
    const cssNodeExtractStub = { processSync: sinon.stub() };
    const fsStub = { readFileSync: sinon.stub().returns(`css`) };
    const parseNodeFiltersStub = sinon.stub().returns([`nodeFilters`]);
    const resolveUrlStub = sinon.stub().returns(`resolved/url`);
    const dependencies = Object.assign(t.context.dependencies, {
        cleanImportUrl: cleanImportUrlStub,
        cssNodeExtract: cssNodeExtractStub,
        fs: fsStub,
        parseNodeFilters: parseNodeFiltersStub,
        resolveUrl: resolveUrlStub,
    });
    const nodeImporter = new NodeImporter_1.NodeImporter(dependencies);
    nodeImporter.import(url, includePaths);
    t.true(parseNodeFiltersStub.calledWith(url));
    t.true(cleanImportUrlStub.calledWith(url));
    t.true(resolveUrlStub.calledWith(`cleaned/url`, includePaths));
    t.true(cssNodeExtractStub.processSync.calledWith({
        css: `css`,
        filterNames: [`nodeFilters`],
        postcssSyntax: postcssScss,
    }));
});
//# sourceMappingURL=NodeImporter.spec.js.map