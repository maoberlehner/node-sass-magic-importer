import { parseNodeFiltersFactory } from './parse-node-filters';

describe(`parseNodeFilters()`, () => {
  test(`It should be a function.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();

    expect(typeof parseNodeFilters).toBe(`function`);
  });

  test(`It should return an empty array if no filters were found.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();

    const urlWithoutFilters = `style.scss`;
    const nodeFilters = parseNodeFilters(urlWithoutFilters);

    const expectedResult: any[] = [];

    expect(nodeFilters).toEqual(expectedResult);
  });

  test(`It should return node filters from URL.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();

    const urlWithFilters = `[at-rules, mixins] from style.scss`;
    const nodeFilters = parseNodeFilters(urlWithFilters);

    const expectedResult = [
      `at-rules`,
      `mixins`,
    ];

    expect(nodeFilters).toEqual(expectedResult);
  });

  test(`It should trim empty filter from multi line URL.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();

    const urlWithFilters = `[
      at-rules,
      mixins,
    ] from style.scss`;
    const nodeFilters = parseNodeFilters(urlWithFilters);

    const expectedResult = [
      `at-rules`,
      `mixins`,
    ];

    expect(nodeFilters).toEqual(expectedResult);
  });
});
