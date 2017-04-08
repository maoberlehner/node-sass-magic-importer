"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const sinon = require("sinon");
const resolve_url_1 = require("../functions/resolve-url");
const OnceImporter_1 = require("./OnceImporter");
ava_1.default.beforeEach((t) => {
    t.context.dependencies = {
        resolveUrl: resolve_url_1.default,
    };
});
ava_1.default(`Should be an object.`, (t) => {
    const onceImporter = new OnceImporter_1.OnceImporter(t.context.dependencies);
    t.is(typeof onceImporter, `object`);
});
ava_1.default(`Should resolve the absolute URL.`, (t) => {
    const url = `test/url`;
    const resolveUrlSpy = sinon.spy();
    const dependenciesStub = {
        resolveUrl: resolveUrlSpy,
    };
    const dependencies = Object.assign(t.context.dependencies, dependenciesStub);
    const onceImporter = new OnceImporter_1.OnceImporter(dependencies);
    onceImporter.import(url, []);
    t.true(resolveUrlSpy.calledWith(url, []));
});
ava_1.default(`Should return an import object (empty, if the URL was already imported).`, (t) => {
    const url = `test/url`;
    const resolveUrlSpy = sinon.spy();
    const onceImporter = new OnceImporter_1.OnceImporter(t.context.dependencies);
    const firstReturnValue = onceImporter.import(url, []);
    const secondReturnValue = onceImporter.import(url, []);
    t.deepEqual(firstReturnValue, { file: url });
    t.deepEqual(secondReturnValue, { file: ``, contents: `` });
});
//# sourceMappingURL=OnceImporter.spec.js.map