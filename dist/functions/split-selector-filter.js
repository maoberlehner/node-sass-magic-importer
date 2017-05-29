"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function splitSelectorFilterFactory() {
    return (combinedFilter) => {
        const [selector, replacement] = combinedFilter.split(` as `)
            .map((x) => x.trim());
        return {
            selector,
            replacement,
        };
    };
}
exports.splitSelectorFilterFactory = splitSelectorFilterFactory;
//# sourceMappingURL=split-selector-filter.js.map