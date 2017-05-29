"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cssNodeExtract = require("css-node-extract");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const postcssScss = require("postcss-scss");
const clean_import_url_1 = require("./functions/clean-import-url");
const extract_nodes_1 = require("./functions/extract-nodes");
const parse_node_filters_1 = require("./functions/parse-node-filters");
const resolve_url_1 = require("./functions/resolve-url");
const sass_glob_pattern_1 = require("./functions/sass-glob-pattern");
const cleanImportUrl = clean_import_url_1.cleanImportUrlFactory();
const parseNodeFilters = parse_node_filters_1.parseNodeFiltersFactory();
const sassGlobPattern = sass_glob_pattern_1.sassGlobPatternFactory(path);
const resolveUrl = resolve_url_1.resolveUrlFactory(glob, path, sassGlobPattern);
const extractNodes = extract_nodes_1.extractNodesFactory(cssNodeExtract, fs, postcssScss);
function nodeImporter(options) {
    return function importer(url, prev) {
        // TODO: Refactor inlcude paths thing in function
        const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
        if (path.isAbsolute(prev)) {
            includePathsSet.add(path.dirname(prev));
        }
        const includePaths = [...includePathsSet];
        const nodeFilters = parseNodeFilters(url);
        if (nodeFilters.length === 0) {
            return null;
        }
        const cleanedUrl = cleanImportUrl(url);
        const resolvedUrl = resolveUrl(cleanedUrl, includePaths);
        const contents = extractNodes(resolvedUrl, nodeFilters);
        return contents ? { contents } : null;
    };
}
exports.default = nodeImporter;
//# sourceMappingURL=node-importer.js.map