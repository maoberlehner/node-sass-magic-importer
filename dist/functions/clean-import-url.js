"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanImportUrl(url) {
    const importUrl = url.split(` from `).pop() || ``;
    return importUrl.trim();
}
exports.cleanImportUrl = cleanImportUrl;
function cleanImportUrlFactory() {
    return cleanImportUrl.bind(null);
}
exports.cleanImportUrlFactory = cleanImportUrlFactory;
exports.default = cleanImportUrlFactory();
//# sourceMappingURL=clean-import-url.js.map