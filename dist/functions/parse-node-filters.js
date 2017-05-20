"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseNodeFilters(url) {
    const nodeFiltersMatch = url.match(/\[([\s\S]*)\]/);
    if (!nodeFiltersMatch) {
        return [];
    }
    return nodeFiltersMatch[1].split(`,`)
        .map((x) => x.trim());
}
exports.parseNodeFilters = parseNodeFilters;
function parseNodeFiltersFactory() {
    return parseNodeFilters.bind(null);
}
exports.parseNodeFiltersFactory = parseNodeFiltersFactory;
exports.default = parseNodeFiltersFactory();
//# sourceMappingURL=parse-node-filters.js.map