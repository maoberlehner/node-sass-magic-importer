"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processRawSelectorFiltersFactory(escapeSelector) {
    return (rawSelectorFilters) => {
        return rawSelectorFilters.map((rawSelectorFilter) => {
            const selectorFilter = { selector: ``, replacement: undefined };
            const matchRegExpSelector = rawSelectorFilter.selector.match(/^\/(.+)\/([a-z]*)$/);
            if (matchRegExpSelector) {
                const pattern = escapeSelector(matchRegExpSelector[1], `\\\\`);
                const flags = matchRegExpSelector[2];
                selectorFilter.selector = new RegExp(pattern, flags);
            }
            else {
                selectorFilter.selector = escapeSelector(rawSelectorFilter.selector);
            }
            selectorFilter.replacement = escapeSelector(rawSelectorFilter.replacement);
            return selectorFilter;
        });
    };
}
exports.processRawSelectorFiltersFactory = processRawSelectorFiltersFactory;
//# sourceMappingURL=process-raw-selector-filters.js.map