"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_raw_selector_filters_1 = require("./process-raw-selector-filters");
const split_selector_filter_1 = require("./split-selector-filter");
function parseSelectorFilters({ processRawSelectorFilters, splitSelectorFilter }, url) {
    const selectorFiltersMatch = url.match(/{([\s\S]*)}/);
    if (!selectorFiltersMatch) {
        return [];
    }
    const rawSelectorFilters = selectorFiltersMatch[1].split(`,`)
        .map((x) => splitSelectorFilter(x.trim()));
    return processRawSelectorFilters(rawSelectorFilters);
}
exports.parseSelectorFilters = parseSelectorFilters;
function parseSelectorFiltersFactory(dependencies) {
    return parseSelectorFilters.bind(null, dependencies);
}
exports.parseSelectorFiltersFactory = parseSelectorFiltersFactory;
exports.default = parseSelectorFiltersFactory({ processRawSelectorFilters: process_raw_selector_filters_1.default, splitSelectorFilter: split_selector_filter_1.default });
//# sourceMappingURL=parse-selector-filters.js.map