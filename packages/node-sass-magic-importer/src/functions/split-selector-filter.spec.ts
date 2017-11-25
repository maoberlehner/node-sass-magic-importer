import { splitSelectorFilterFactory } from './split-selector-filter';

describe(`splitSelectorFilter()`, () => {
  test(`It should be a function.`, () => {
    const splitSelectorFilter = splitSelectorFilterFactory();

    expect(typeof splitSelectorFilter).toBe(`function`);
  });

  test(`It should split selector filters and trim parts.`, () => {
    const splitSelectorFilter = splitSelectorFilterFactory();
    const splittedSelectorFilter = splitSelectorFilter(`.some-selector  as .some-replacement `);

    expect(splittedSelectorFilter).toEqual({
      selector: `.some-selector`,
      replacement: `.some-replacement`,
    });
  });
});
