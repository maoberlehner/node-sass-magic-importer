import { escapeSelectorFactory } from './escape-selector';
import { processRawSelectorFiltersFactory } from './process-raw-selector-filters';
import { splitSelectorFilterFactory } from './split-selector-filter';

import { parseSelectorFiltersFactory } from './parse-selector-filters';

const escapeSelector = escapeSelectorFactory();
const processRawSelectorFilters = processRawSelectorFiltersFactory(escapeSelector);
const splitSelectorFilter = splitSelectorFilterFactory();

let dependencies: any;

describe(`parseSelectorFilters()`, () => {
  beforeEach(() => {
    dependencies = {
      processRawSelectorFilters,
      splitSelectorFilter,
    };
  });

  test(`It should be a function.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );

    expect(typeof parseSelectorFilters).toBe(`function`);
  });

  test(`It should return an empty array if there is no filter divider.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithoutFilters = `style.scss`;

    const selectorFilters = parseSelectorFilters(urlWithoutFilters);
    const expectedResult: any[] = [];

    expect(selectorFilters).toEqual(expectedResult);
  });

  test(`It should return an empty array if no filters were found.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithoutFilters = `[some-thing] from style.scss`;

    const selectorFilters = parseSelectorFilters(urlWithoutFilters);
    const expectedResult: any[] = [];

    expect(selectorFilters).toEqual(expectedResult);
  });

  test(`It should return selector filters from URL.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithFilters = `{ .btn, .btn-alert } from style.scss`;

    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
      {
        replacement: undefined,
        selector: `.btn`,
      },
      {
        replacement: undefined,
        selector: `.btn-alert`,
      },
    ];

    expect(selectorFilters).toEqual(expectedResult);
  });

  test(`It should return selector filters and replacements from URL.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithFilters = `{ .btn as .button, .btn-alert as .button-alert } from style.scss`;

    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
      {
        replacement: `.button`,
        selector: `.btn`,
      },
      {
        replacement: `.button-alert`,
        selector: `.btn-alert`,
      },
    ];

    expect(selectorFilters).toEqual(expectedResult);
  });

  test(`It should ignore curly brackets used in a glob pattern.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithFilters = `style{1}.scss`;

    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult: any[] = [];

    expect(selectorFilters).toEqual(expectedResult);
  });

  test(`It should return selector filters from URL with glob pattern.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithFilters = `{ .btn, .btn-alert } from style{1}.scss`;

    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
      {
        replacement: undefined,
        selector: `.btn`,
      },
      {
        replacement: undefined,
        selector: `.btn-alert`,
      },
    ];

    expect(selectorFilters).toEqual(expectedResult);
  });

  test(`It should return selector filters when filter contains \`from\`.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithFilters = `{ .btn, .btn-alert, .from } from style.scss`;

    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
      {
        replacement: undefined,
        selector: `.btn`,
      },
      {
        replacement: undefined,
        selector: `.btn-alert`,
      },
      {
        replacement: undefined,
        selector: `.from`,
      },
    ];

    expect(selectorFilters).toEqual(expectedResult);
  });

  test(`It should handle special characters.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithFilters = `{ .btn@m as .button@m } from style.scss`;

    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
      {
        replacement: `.button\\@m`,
        selector: `.btn\\@m`,
      },
    ];

    expect(selectorFilters).toEqual(expectedResult);
  });

  test(`It should handle regular expressions.`, () => {
    const parseSelectorFilters = parseSelectorFiltersFactory(
      dependencies.processRawSelectorFilters,
      dependencies.splitSelectorFilter,
    );
    const urlWithFilters = `{ /^\\.btn(.*)/i as .button$1 } from style.scss`;

    const selectorFilters = parseSelectorFilters(urlWithFilters);
    const expectedResult = [
      {
        replacement: `.button$1`,
        selector: /^\.btn(.*)/i,
      },
    ];

    expect(selectorFilters).toEqual(expectedResult);
  });
});
