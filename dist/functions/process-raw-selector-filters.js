"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escape_selector_1 = require("./escape-selector");
function processRawSelectorFilters({ escapeSelector }, rawSelectorFilters) {
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
}
exports.processRawSelectorFilters = processRawSelectorFilters;
function processRawSelectorFiltersFactory(dependencies) {
    return processRawSelectorFilters.bind(null, dependencies);
}
exports.processRawSelectorFiltersFactory = processRawSelectorFiltersFactory;
exports.default = processRawSelectorFiltersFactory({ escapeSelector: escape_selector_1.default });
//# sourceMappingURL=process-raw-selector-filters.js.map