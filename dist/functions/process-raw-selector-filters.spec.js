"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const sinon = require("sinon");
const escape_selector_1 = require("./escape-selector");
const process_raw_selector_filters_1 = require("./process-raw-selector-filters");
ava_1.default.beforeEach((t) => {
    const escapeSelector = escape_selector_1.escapeSelectorFactory();
    t.context.dep = {
        escapeSelector,
    };
});
ava_1.default(`Should be a function.`, (t) => {
    const processRawSelectorFilters = process_raw_selector_filters_1.processRawSelectorFiltersFactory(t.context.dep.escapeSelector);
    t.is(typeof processRawSelectorFilters, `function`);
});
ava_1.default(`Should escape the selector and replacement.`, (t) => {
    const escapeSelectorStub = sinon.stub(t.context.dep, `escapeSelector`);
    const processRawSelectorFilters = process_raw_selector_filters_1.processRawSelectorFiltersFactory(escapeSelectorStub);
    processRawSelectorFilters([{
            selector: `.some-selector`,
            replacement: `.some-replacement`,
        }]);
    t.true(escapeSelectorStub.calledWith(`.some-selector`));
    t.true(escapeSelectorStub.calledWith(`.some-replacement`));
});
ava_1.default(`Should detect and handle RegExp selectors.`, (t) => {
    const escapeSelectorStub = sinon.stub(t.context.dep, `escapeSelector`);
    const processRawSelectorFilters = process_raw_selector_filters_1.processRawSelectorFiltersFactory(escapeSelectorStub);
    processRawSelectorFilters([{ selector: `/regex/i`, replacement: undefined }]);
    t.true(escapeSelectorStub.calledWith(`regex`));
});
//# sourceMappingURL=process-raw-selector-filters.spec.js.map