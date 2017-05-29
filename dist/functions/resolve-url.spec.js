"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const glob = require("glob");
const path = require("path");
const sinon = require("sinon");
const sass_glob_pattern_1 = require("./sass-glob-pattern");
const resolve_url_1 = require("./resolve-url");
ava_1.default.beforeEach((t) => {
    const sassGlobPattern = sass_glob_pattern_1.sassGlobPatternFactory(path);
    t.context.dep = {
        sassGlobPattern,
    };
});
ava_1.default(`Should be a function.`, (t) => {
    const resolveUrl = resolve_url_1.resolveUrlFactory(glob, path, t.context.dep.sassGlobPattern);
    t.is(typeof resolveUrl, `function`);
});
ava_1.default(`Should call glob.sync() with resolved include path.`, (t) => {
    const globStub = { sync: sinon.stub().returns([]) };
    const sassGlobPatternStub = sinon.stub(t.context.dep, `sassGlobPattern`).returns(`some/string`);
    const resolveUrl = resolve_url_1.resolveUrlFactory(globStub, path, sassGlobPatternStub);
    resolveUrl(`test/url`, [`test/include/path`]);
    t.true(sassGlobPatternStub.calledWith(`url`));
    t.true(globStub.sync.called);
});
ava_1.default(`Should return the given URL if no absolute URL can be resolved.`, (t) => {
    const url = `test/url`;
    const sassGlobPatternStub = sinon.stub(t.context.dep, `sassGlobPattern`).returns(`some/string`);
    const resolveUrl = resolve_url_1.resolveUrlFactory(glob, path, sassGlobPatternStub);
    const resolvedUrl = resolveUrl(url, [`test/include/path`]);
    t.is(resolvedUrl, url);
});
ava_1.default(`Should return the absolute URL to a file.`, (t) => {
    const url = `files/combined.scss`;
    const includePath = `/`;
    const absoluteUrl = path.resolve(includePath, url);
    const globStub = { sync: sinon.stub().returns([absoluteUrl]) };
    const sassGlobPatternStub = sinon.stub(t.context.dep, `sassGlobPattern`).returns(`combined.scss`);
    const resolveUrl = resolve_url_1.resolveUrlFactory(globStub, path, sassGlobPatternStub);
    const resolvedUrl = resolveUrl(url, [includePath]);
    t.is(resolvedUrl, absoluteUrl);
});
//# sourceMappingURL=resolve-url.spec.js.map