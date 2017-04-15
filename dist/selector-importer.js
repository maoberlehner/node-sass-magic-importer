"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const SelectorImporter_1 = require("./classes/SelectorImporter");
function selectorImporter(options) {
    const selectorImporter = SelectorImporter_1.selectorImporterFactory();
    return function importer(url, prev) {
        const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
        if (path.isAbsolute(prev)) {
            includePathsSet.add(path.dirname(prev));
        }
        const includePaths = [...includePathsSet];
        return selectorImporter.import(url, includePaths);
    };
}
exports.default = selectorImporter;
//# sourceMappingURL=selector-importer.js.map