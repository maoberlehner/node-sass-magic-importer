"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const parse_node_filters_1 = require("./parse-node-filters");
ava_1.default(`Should be a function.`, (t) => {
    const parseNodeFilters = parse_node_filters_1.parseNodeFiltersFactory();
    t.is(typeof parseNodeFilters, `function`);
});
ava_1.default(`Should return an empty array if no filters were found.`, (t) => {
    const parseNodeFilters = parse_node_filters_1.parseNodeFiltersFactory();
    const urlWithoutFilters = `style.scss`;
    const nodeFilters = parseNodeFilters(urlWithoutFilters);
    const expectedResult = [];
    t.deepEqual(nodeFilters, expectedResult);
});
ava_1.default(`Should return node filters from URL.`, (t) => {
    const parseNodeFilters = parse_node_filters_1.parseNodeFiltersFactory();
    const urlWithFilters = `[at-rules, mixins] from style.scss`;
    const nodeFilters = parseNodeFilters(urlWithFilters);
    const expectedResult = [
        `at-rules`,
        `mixins`,
    ];
    t.deepEqual(nodeFilters, expectedResult);
});
//# sourceMappingURL=parse-node-filters.spec.js.map