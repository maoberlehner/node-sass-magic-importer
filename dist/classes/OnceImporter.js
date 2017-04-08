"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolve_url_1 = require("../functions/resolve-url");
class OnceImporter {
    constructor({ resolveUrl }) {
        this.resolveUrl = resolveUrl;
        this.store = new Set();
    }
    import(url, includePaths = []) {
        const resolvedUrl = this.resolveUrl(url, includePaths);
        if (this.store.has(resolvedUrl)) {
            return {
                file: ``,
                contents: ``,
            };
        }
        this.store.add(resolvedUrl);
        return { file: url };
    }
}
exports.OnceImporter = OnceImporter;
function onceImporterFactory() {
    return new OnceImporter({ resolveUrl: resolve_url_1.default });
}
exports.onceImporterFactory = onceImporterFactory;
//# sourceMappingURL=OnceImporter.js.map