"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeSelector(selector, escapeSequence = `\\`) {
    if (!selector) {
        return selector;
    }
    const specialCharacters = [`@`];
    const regexSpecialCharacters = [`/`];
    const regex = new RegExp(`(?!@mixin)(${specialCharacters.join(`|`)}|\\${regexSpecialCharacters.join(`|\\`)})`, `g`);
    return selector.replace(regex, `${escapeSequence}$1`);
}
exports.escapeSelector = escapeSelector;
function escapeSelectorFactory() {
    return escapeSelector.bind(null);
}
exports.escapeSelectorFactory = escapeSelectorFactory;
exports.default = escapeSelectorFactory();
//# sourceMappingURL=escape-selector.js.map