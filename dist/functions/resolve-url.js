"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolveUrlFactory(glob, path, sassGlobPattern) {
    return (url, includePaths = []) => {
        const { dir, base } = path.parse(url);
        const baseGlobPattern = sassGlobPattern(base);
        let resolvedUrls = [];
        includePaths.some((includePath) => {
            resolvedUrls = glob.sync(path.resolve(includePath, dir, baseGlobPattern));
            return resolvedUrls.length > 0 || false;
        });
        return resolvedUrls[0] || url;
    };
}
exports.resolveUrlFactory = resolveUrlFactory;
//# sourceMappingURL=resolve-url.js.map