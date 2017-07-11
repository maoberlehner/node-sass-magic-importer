"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toolbox_1 = require("node-sass-magic-importer/dist/toolbox");
function selectorImporter(options) {
    return function importer(url, prev) {
        const nodeSassOptions = this.options;
        const selectorFilters = toolbox_1.parseSelectorFilters(url);
        if (selectorFilters.length === 0) {
            return null;
        }
        const includePaths = toolbox_1.buildIncludePaths(nodeSassOptions.includePaths, prev);
        const cleanedUrl = toolbox_1.cleanImportUrl(url);
        const resolvedUrl = toolbox_1.resolveUrl(cleanedUrl, includePaths);
        const contents = toolbox_1.extractSelectors(resolvedUrl, selectorFilters);
        return contents ? { contents } : null;
    };
}
exports.default = selectorImporter;
//# sourceMappingURL=index.js.map