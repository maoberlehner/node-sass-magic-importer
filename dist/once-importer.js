"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const OnceImporter_1 = require("./classes/OnceImporter");
function onceImporter(options) {
    const defaultOptions = { cwd: process.cwd() };
    const importerOptions = Object.assign({}, defaultOptions, options);
    const onceImporter = OnceImporter_1.onceImporterFactory(importerOptions);
    return function importer(url, prev) {
        const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
        if (path.isAbsolute(prev)) {
            includePathsSet.add(path.dirname(prev));
        }
        const includePaths = [...includePathsSet];
        return onceImporter.import(url, includePaths);
    };
}
exports.default = onceImporter;
;
//# sourceMappingURL=once-importer.js.map