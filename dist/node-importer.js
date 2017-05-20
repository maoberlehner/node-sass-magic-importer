"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const NodeImporter_1 = require("./classes/NodeImporter");
function nodeImporter(options) {
    const nodeImporter = NodeImporter_1.nodeImporterFactory();
    return function importer(url, prev) {
        const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
        if (path.isAbsolute(prev)) {
            includePathsSet.add(path.dirname(prev));
        }
        const includePaths = [...includePathsSet];
        return nodeImporter.import(url, includePaths);
    };
}
exports.default = nodeImporter;
//# sourceMappingURL=node-importer.js.map