"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const path = require("path");
const sass_glob_pattern_1 = require("./sass-glob-pattern");
function resolveUrl({ glob, path, sassGlobPattern }, url, includePaths = []) {
    const { dir, base } = path.parse(url);
    const baseGlobPattern = sassGlobPattern(base);
    let resolvedUrls = [];
    includePaths.some((includePath) => {
        resolvedUrls = glob.sync(path.resolve(includePath, dir, baseGlobPattern));
        return resolvedUrls.length > 0 || false;
    });
    return resolvedUrls[0] || url;
}
exports.resolveUrl = resolveUrl;
function resolveUrlFactory(dependencies) {
    return resolveUrl.bind(null, dependencies);
}
exports.resolveUrlFactory = resolveUrlFactory;
exports.default = resolveUrlFactory({ glob, path, sassGlobPattern: sass_glob_pattern_1.default });
//# sourceMappingURL=resolve-url.js.map