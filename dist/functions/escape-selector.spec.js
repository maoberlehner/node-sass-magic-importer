"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const escape_selector_1 = require("./escape-selector");
ava_1.default(`Should be a function.`, (t) => {
    const escapeSelector = escape_selector_1.escapeSelectorFactory();
    t.is(typeof escapeSelector, `function`);
});
ava_1.default(`Should escape special characters.`, (t) => {
    const escapeSelector = escape_selector_1.escapeSelectorFactory();
    t.is(escapeSelector(`@/@mixin`), `\\@\\/@mixin`);
});
//# sourceMappingURL=escape-selector.spec.js.map