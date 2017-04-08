"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function sassGlobPattern({ path }, base) {
    const { name, ext } = path.parse(base);
    return ext ? base : `?(_)${name}@(.css|.sass|.scss)`;
}
exports.sassGlobPattern = sassGlobPattern;
function sassGlobPatternFactory(dependencies) {
    return sassGlobPattern.bind(null, dependencies);
}
exports.sassGlobPatternFactory = sassGlobPatternFactory;
exports.default = sassGlobPatternFactory({ path });
//# sourceMappingURL=sass-glob-pattern.js.map