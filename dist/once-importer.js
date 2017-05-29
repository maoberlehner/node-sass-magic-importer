"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const path = require("path");
const resolve_url_1 = require("./functions/resolve-url");
const sass_glob_pattern_1 = require("./functions/sass-glob-pattern");
const sassGlobPattern = sass_glob_pattern_1.sassGlobPatternFactory(path);
const resolveUrl = resolve_url_1.resolveUrlFactory(glob, path, sassGlobPattern);
function onceImporter(options) {
    const contextTemplate = {
        store: new Set(),
    };
    return function importer(url, prev) {
        // Create a context for the current importer run.
        // An importer run is different from an importer instance,
        // one importer instance can spawn infinite importer runs.
        if (!this.nodeSassOnceImporterContext) {
            this.nodeSassOnceImporterContext = Object.assign({}, contextTemplate);
        }
        // Each importer run has it's own new store, otherwise
        // files already imported in a previous importer run
        // would be detected as multiple imports of the same file.
        const store = this.nodeSassOnceImporterContext.store;
        // TODO: Refactor inlcude paths thing in function
        const includePathsSet = new Set(this.options.includePaths.split(path.delimiter));
        if (path.isAbsolute(prev)) {
            includePathsSet.add(path.dirname(prev));
        }
        const includePaths = [...includePathsSet];
        const resolvedUrl = resolveUrl(url, includePaths);
        if (store.has(resolvedUrl)) {
            return {
                file: ``,
                contents: ``,
            };
        }
        store.add(resolvedUrl);
        return null;
    };
}
exports.default = onceImporter;
//# sourceMappingURL=once-importer.js.map