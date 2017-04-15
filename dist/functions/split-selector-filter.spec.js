"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const split_selector_filter_1 = require("./split-selector-filter");
ava_1.default(`Should be a function.`, (t) => {
    const splitSelectorFilter = split_selector_filter_1.splitSelectorFilterFactory();
    t.is(typeof splitSelectorFilter, `function`);
});
ava_1.default(`Should split selector filters and trim parts.`, (t) => {
    const splitSelectorFilter = split_selector_filter_1.splitSelectorFilterFactory();
    const splittedSelectorFilter = splitSelectorFilter(`.some-selector  as .some-replacement `);
    t.deepEqual(splittedSelectorFilter, {
        selector: `.some-selector`,
        replacement: `.some-replacement`,
    });
});
//# sourceMappingURL=split-selector-filter.spec.js.map