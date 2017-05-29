"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const path = require("path");
const sass_glob_pattern_1 = require("./sass-glob-pattern");
ava_1.default(`Should be a function.`, (t) => {
    const sassGlobPattern = sass_glob_pattern_1.sassGlobPatternFactory(path);
    t.is(typeof sassGlobPattern, `function`);
});
ava_1.default(`Should return unmodified base URL if URL with extension is given.`, (t) => {
    const sassGlobPattern = sass_glob_pattern_1.sassGlobPatternFactory(path);
    const url = sassGlobPattern(`base-with.extension`);
    t.is(url, `base-with.extension`);
});
ava_1.default(`Should return glob pattern from clean base URL.`, (t) => {
    const sassGlobPattern = sass_glob_pattern_1.sassGlobPatternFactory(path);
    const url = sassGlobPattern(`clean-base`);
    t.is(url, `?(_)clean-base@(.css|.sass|.scss)`);
});
//# sourceMappingURL=sass-glob-pattern.spec.js.map