"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const cssNodeExtract = require("css-node-extract");
const fs = require("fs");
const postcssSyntax = require("postcss-scss");
const sinon = require("sinon");
const extract_nodes_1 = require("./extract-nodes");
ava_1.default(`Should be a function.`, (t) => {
    const extractNodes = extract_nodes_1.extractNodesFactory(cssNodeExtract, fs, postcssSyntax);
    t.is(typeof extractNodes, `function`);
});
ava_1.default(`Should run cssNodeExtract with file contents.`, (t) => {
    const cssNodeExtractStub = { processSync: sinon.stub() };
    const fsStub = { readFileSync: sinon.stub().returns(`.css {}`) };
    const extractNodes = extract_nodes_1.extractNodesFactory(cssNodeExtractStub, fsStub, postcssSyntax);
    extractNodes(`some-url`, []);
    t.true(fsStub.readFileSync.calledWith(`some-url`));
    t.true(cssNodeExtractStub.processSync.called);
});
//# sourceMappingURL=extract-nodes.spec.js.map