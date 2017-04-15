"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const process_raw_selector_filters_1 = require("./process-raw-selector-filters");
const split_selector_filter_1 = require("./split-selector-filter");
const parse_selector_filters_1 = require("./parse-selector-filters");
ava_1.default.beforeEach((t) => {
    t.context.dependencies = {
        processRawSelectorFilters: process_raw_selector_filters_1.default,
        splitSelectorFilter: split_selector_filter_1.default,
    };
});
ava_1.default(`Should be a function.`, (t) => {
    const parseSelectorFilters = parse_selector_filters_1.parseSelectorFiltersFactory(t.context.dependencies);
    t.is(typeof parseSelectorFilters, `function`);
});
ava_1.default(`Should return an empty array if no filters were found.`, (t) => {
    const parseSelectorFilters = parse_selector_filters_1.parseSelectorFiltersFactory(t.context.dependencies);
    const urlWithoutFilters = `style.scss`;
    const selectorFilters = parseSelectorFilters(urlWithoutFilters);
    const expectedResult = [];
    t.deepEqual(selectorFilters, expectedResult);
});
ava_1.default(`Should return selector filters from URL.`, (t) => {
    const parseSelectorFilters = parse_selector_filters_1.parseSelectorFiltersFactory(t.context.dependencies);
    const urlWithFilters = `{ .btn, .btn-alert } from style.scss`;
    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
        {
            replacement: undefined,
            selector: `.btn`,
        },
        {
            replacement: undefined,
            selector: `.btn-alert`,
        },
    ];
    t.deepEqual(selectorFilters, expectedResult);
});
ava_1.default(`Should return selector filters and replacements from URL.`, (t) => {
    const parseSelectorFilters = parse_selector_filters_1.parseSelectorFiltersFactory(t.context.dependencies);
    const urlWithFilters = `{ .btn as .button, .btn-alert as .button-alert } from style.scss`;
    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
        {
            replacement: `.button`,
            selector: `.btn`,
        },
        {
            replacement: `.button-alert`,
            selector: `.btn-alert`,
        },
    ];
    t.deepEqual(selectorFilters, expectedResult);
});
ava_1.default(`Should handle special characters.`, (t) => {
    const parseSelectorFilters = parse_selector_filters_1.parseSelectorFiltersFactory(t.context.dependencies);
    const urlWithFilters = `{ .btn@m as .button@m } from style.scss`;
    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
        {
            replacement: `.button\\@m`,
            selector: `.btn\\@m`,
        },
    ];
    t.deepEqual(selectorFilters, expectedResult);
});
ava_1.default(`Should handle regular expressions.`, (t) => {
    const parseSelectorFilters = parse_selector_filters_1.parseSelectorFiltersFactory(t.context.dependencies);
    const urlWithFilters = `{ /^\\.btn(.*)/i as .button$1 } from style.scss`;
    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
        {
            replacement: `.button$1`,
            selector: /^\.btn(.*)/i,
        },
    ];
    t.deepEqual(selectorFilters, expectedResult);
});
//# sourceMappingURL=parse-selector-filters.spec.js.map