"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractNodesFactory(cssNodeExtract, fs, postcssSyntax) {
    return (resolvedUrl, filters) => {
        const css = fs.readFileSync(resolvedUrl, { encoding: `utf8` });
        return cssNodeExtract.processSync({
            css,
            filters,
            postcssSyntax,
        });
    };
}
exports.extractNodesFactory = extractNodesFactory;
//# sourceMappingURL=extract-nodes.js.map