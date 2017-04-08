"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const clean_import_url_1 = require("./clean-import-url");
ava_1.default(`Should be a function.`, (t) => {
    const cleanImportUrl = clean_import_url_1.cleanImportUrlFactory();
    t.is(typeof cleanImportUrl, `function`);
});
ava_1.default(`Should return URL without filters.`, (t) => {
    const cleanImportUrl = clean_import_url_1.cleanImportUrlFactory();
    const urlWithSelectorFilters = `{ .btn, .btn-alert } from style.scss`;
    const urlWithNodeFilters = `[variables, mixins] from style.scss`;
    const urlWithBoth = `[variables, mixins] { .btn, .btn-alert } from style.scss`;
    const urlWithoutFilters = `style.scss`;
    const urlCleanedSelectorFilters = cleanImportUrl(urlWithSelectorFilters);
    const urlCleanedNodeFilters = cleanImportUrl(urlWithNodeFilters);
    const urlCleanedBoth = cleanImportUrl(urlWithBoth);
    const urlCleanedFilters = cleanImportUrl(urlWithoutFilters);
    t.is(urlCleanedSelectorFilters, `style.scss`);
    t.is(urlCleanedNodeFilters, `style.scss`);
    t.is(urlCleanedBoth, `style.scss`);
    t.is(urlCleanedFilters, `style.scss`);
});
//# sourceMappingURL=clean-import-url.spec.js.map