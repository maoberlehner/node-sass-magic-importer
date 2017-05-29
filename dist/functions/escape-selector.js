"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeSelectorFactory() {
    return (selector, escapeSequence = `\\`) => {
        if (!selector) {
            return selector;
        }
        const specialCharacters = [`@`];
        const regexSpecialCharacters = [`/`];
        const regex = new RegExp(`(?!@mixin)(${specialCharacters.join(`|`)}|\\${regexSpecialCharacters.join(`|\\`)})`, `g`);
        return selector.replace(regex, `${escapeSequence}$1`);
    };
}
exports.escapeSelectorFactory = escapeSelectorFactory;
//# sourceMappingURL=escape-selector.js.map