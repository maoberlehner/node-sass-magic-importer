"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseNodeFiltersFactory() {
    return (url) => {
        const nodeFiltersMatch = url.match(/\[([\s\S]*)\]/);
        if (!nodeFiltersMatch) {
            return [];
        }
        return nodeFiltersMatch[1].split(`,`)
            .map((x) => x.trim());
    };
}
exports.parseNodeFiltersFactory = parseNodeFiltersFactory;
//# sourceMappingURL=parse-node-filters.js.map