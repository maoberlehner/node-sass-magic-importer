"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const cssSelectorExtract = require("css-selector-extract");
const fs = require("fs");
const postcssSyntax = require("postcss-scss");
const sinon = require("sinon");
const extract_selectors_1 = require("./extract-selectors");
ava_1.default(`Should be a function.`, (t) => {
    const extractSelectors = extract_selectors_1.extractSelectorsFactory(cssSelectorExtract, fs, postcssSyntax);
    t.is(typeof extractSelectors, `function`);
});
ava_1.default(`Should run cssSelectorExtract with file contents.`, (t) => {
    const cssSelectorExtractStub = { processSync: sinon.stub() };
    const fsStub = { readFileSync: sinon.stub().returns(`.css {}`) };
    const extractSelectors = extract_selectors_1.extractSelectorsFactory(cssSelectorExtractStub, fsStub, postcssSyntax);
    extractSelectors(`some-url`, []);
    t.true(fsStub.readFileSync.calledWith(`some-url`));
    t.true(cssSelectorExtractStub.processSync.called);
});
//# sourceMappingURL=extract-selectors.spec.js.map