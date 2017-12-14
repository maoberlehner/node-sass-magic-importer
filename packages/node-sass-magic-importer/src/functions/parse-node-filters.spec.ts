import { parseNodeFiltersFactory } from './parse-node-filters';

describe(`parseNodeFilters()`, () => {
  test(`It should be a function.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();

    expect(typeof parseNodeFilters).toBe(`function`);
  });

  test(`It should return an empty array if there is no filter divider.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();
    const urlWithoutFilters = `style.scss`;

    const nodeFilters = parseNodeFilters(urlWithoutFilters);
    const expectedResult: any[] = [];

    expect(nodeFilters).toEqual(expectedResult);
  });

  test(`It should return an empty array if no filters were found.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();
    const urlWithoutFilters = `{ .some-thing } from style.scss`;

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

  test(`It should ignore brackets used in a glob pattern.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();
    const urlWithGlobPattern = `[!_]style.scss`;

    const nodeFilters = parseNodeFilters(urlWithGlobPattern);
    const expectedResult: any[] = [];

    expect(nodeFilters).toEqual(expectedResult);
  });

  test(`It should return node filters from URL with glob pattern.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();
    const urlWithFilters = `[at-rules, mixins] from [!_]style.scss`;

    const nodeFilters = parseNodeFilters(urlWithFilters);
    const expectedResult = [
      `at-rules`,
      `mixins`,
    ];

    expect(nodeFilters).toEqual(expectedResult);
  });

  test(`It should return node filters when filter contains \`from\`.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();
    const urlWithFilters = `[at-rules, mixins, from] from style.scss`;

    const nodeFilters = parseNodeFilters(urlWithFilters);
    const expectedResult = [
      `at-rules`,
      `mixins`,
      `from`,
    ];

    expect(nodeFilters).toEqual(expectedResult);
  });

  test(`It should handle spaces in node filters.`, () => {
    const parseNodeFilters = parseNodeFiltersFactory();
    const urlWithFilters = `[ at-rules, mixins, from ] from style.scss`;

    const nodeFilters = parseNodeFilters(urlWithFilters);
    const expectedResult = [
      `at-rules`,
      `mixins`,
      `from`,
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
