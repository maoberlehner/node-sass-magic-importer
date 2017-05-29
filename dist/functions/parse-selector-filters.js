"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseSelectorFiltersFactory(processRawSelectorFilters, splitSelectorFilter) {
    return (url) => {
        const selectorFiltersMatch = url.match(/{([\s\S]*)}/);
        if (!selectorFiltersMatch) {
            return [];
        }
        const rawSelectorFilters = selectorFiltersMatch[1].split(`,`)
            .map((x) => splitSelectorFilter(x.trim()));
        return processRawSelectorFilters(rawSelectorFilters);
    };
}
exports.parseSelectorFiltersFactory = parseSelectorFiltersFactory;
//# sourceMappingURL=parse-selector-filters.js.map