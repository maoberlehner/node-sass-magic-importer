"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanImportUrlFactory() {
    return (url) => {
        const importUrl = url.split(` from `).pop() || ``;
        return importUrl.trim();
    };
}
exports.cleanImportUrlFactory = cleanImportUrlFactory;
//# sourceMappingURL=clean-import-url.js.map