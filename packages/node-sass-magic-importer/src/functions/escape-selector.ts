import { IEscapeSelector } from '../interfaces/IEscapeSelector';

export function escapeSelectorFactory(): IEscapeSelector {
  return (selector: string, escapeSequence = `\\`) => {
    if (!selector) {
      return selector;
    }

    const specialCharacters = [`@`];
    const regexSpecialCharacters = [`/`];
    const regex = new RegExp(
      `(?!@mixin)(${specialCharacters.join(`|`)}|\\${regexSpecialCharacters.join(`|\\`)})`, `g`,
    );

    return selector.replace(regex, `${escapeSequence}$1`);
  };
}
