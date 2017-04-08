"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanImportUrl(url) {
    return url.split(` from `).pop().trim();
}
exports.cleanImportUrl = cleanImportUrl;
function cleanImportUrlFactory() {
    return cleanImportUrl.bind(null);
}
exports.cleanImportUrlFactory = cleanImportUrlFactory;
exports.default = cleanImportUrlFactory();
//# sourceMappingURL=clean-import-url.js.map