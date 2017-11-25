import { escapeSelectorFactory } from './escape-selector';

describe(`escapeSelector()`, () => {
  test(`It should be a function.`, () => {
    const escapeSelector = escapeSelectorFactory();

    expect(typeof escapeSelector).toBe(`function`);
  });

  test(`It should escape special characters.`, () => {
    const escapeSelector = escapeSelectorFactory();

    expect(escapeSelector(`@/@mixin`)).toBe(`\\@\\/@mixin`);
  });
});
