"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sassGlobPatternFactory(path) {
    return (base) => {
        const { name, ext } = path.parse(base);
        return ext ? base : `?(_)${name}@(.css|.sass|.scss)`;
    };
}
exports.sassGlobPatternFactory = sassGlobPatternFactory;
//# sourceMappingURL=sass-glob-pattern.js.map