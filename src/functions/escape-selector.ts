export function escapeSelector(selector: string, escapeSequence = `\\`) {
  if (!selector) {
    return selector;
  }

  const specialCharacters = [`@`];
  const regexSpecialCharacters = [`/`];
  const regex = new RegExp(
    `(?!@mixin)(${specialCharacters.join(`|`)}|\\${regexSpecialCharacters.join(`|\\`)})`, `g`,
  );

  return selector.replace(regex, `${escapeSequence}$1`);
}

export function escapeSelectorFactory(): typeof escapeSelector {
  return escapeSelector.bind(null);
}

export default escapeSelectorFactory();
