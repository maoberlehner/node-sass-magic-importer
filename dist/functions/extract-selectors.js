"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractSelectorsFactory(cssSelectorExtract, fs, postcssSyntax) {
    return (resolvedUrl, filters) => {
        const css = fs.readFileSync(resolvedUrl, { encoding: `utf8` });
        return cssSelectorExtract.processSync({
            css,
            filters,
            postcssSyntax,
        });
    };
}
exports.extractSelectorsFactory = extractSelectorsFactory;
//# sourceMappingURL=extract-selectors.js.map