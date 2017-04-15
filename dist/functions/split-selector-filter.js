"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function splitSelectorFilter(combinedFilter) {
    const [selector, replacement] = combinedFilter.split(` as `)
        .map((x) => x.trim());
    return {
        selector,
        replacement,
    };
}
exports.splitSelectorFilter = splitSelectorFilter;
function splitSelectorFilterFactory() {
    return splitSelectorFilter.bind(null);
}
exports.splitSelectorFilterFactory = splitSelectorFilterFactory;
exports.default = splitSelectorFilterFactory();
//# sourceMappingURL=split-selector-filter.js.map