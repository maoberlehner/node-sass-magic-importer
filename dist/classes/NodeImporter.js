"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cssNodeExtract = require("css-node-extract");
const fs = require("fs");
const postcssScss = require("postcss-scss");
const clean_import_url_1 = require("../functions/clean-import-url");
const parse_node_filters_1 = require("../functions/parse-node-filters");
const resolve_url_1 = require("../functions/resolve-url");
class NodeImporter {
    constructor({ cleanImportUrl, cssNodeExtract, fs, parseNodeFilters, postcssScss, resolveUrl, }) {
        this.cleanImportUrl = cleanImportUrl;
        this.cssNodeExtract = cssNodeExtract;
        this.fs = fs;
        this.parseNodeFilters = parseNodeFilters;
        this.postcssScss = postcssScss;
        this.resolveUrl = resolveUrl;
    }
    import(url, includePaths = []) {
        const nodeFilters = this.parseNodeFilters(url);
        if (nodeFilters.length === 0) {
            return null;
        }
        const cleanedUrl = this.cleanImportUrl(url);
        const resolvedUrl = this.resolveUrl(cleanedUrl, includePaths);
        const contents = this.extractNodes(resolvedUrl, nodeFilters);
        return contents ? { contents } : null;
    }
    extractNodes(resolvedUrl, nodeFilters) {
        const css = this.fs.readFileSync(resolvedUrl, { encoding: `utf8` });
        return this.cssNodeExtract.processSync({
            css,
            filterNames: nodeFilters,
            postcssSyntax: this.postcssScss,
        });
    }
}
exports.NodeImporter = NodeImporter;
function nodeImporterFactory() {
    return new NodeImporter({
        cleanImportUrl: clean_import_url_1.default,
        cssNodeExtract,
        fs,
        parseNodeFilters: parse_node_filters_1.default,
        postcssScss,
        resolveUrl: resolve_url_1.default,
    });
}
exports.nodeImporterFactory = nodeImporterFactory;
//# sourceMappingURL=NodeImporter.js.map