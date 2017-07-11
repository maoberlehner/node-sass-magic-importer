"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toolbox_1 = require("node-sass-magic-importer/dist/toolbox");
function nodeImporter() {
    return function importer(url, prev) {
        const nodeSassOptions = this.options;
        const nodeFilters = toolbox_1.parseNodeFilters(url);
        if (nodeFilters.length === 0) {
            return null;
        }
        const includePaths = toolbox_1.buildIncludePaths(nodeSassOptions.includePaths, prev);
        const cleanedUrl = toolbox_1.cleanImportUrl(url);
        const resolvedUrl = toolbox_1.resolveUrl(cleanedUrl, includePaths);
        const contents = toolbox_1.extractNodes(resolvedUrl, nodeFilters);
        return contents ? { contents } : null;
    };
}
exports.default = nodeImporter;
//# sourceMappingURL=index.js.map