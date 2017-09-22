import test from 'ava';

import { parseNodeFiltersFactory } from './parse-node-filters';

test(`Should be a function.`, (t) => {
  const parseNodeFilters = parseNodeFiltersFactory();

  t.is(typeof parseNodeFilters, `function`);
});

test(`Should return an empty array if no filters were found.`, (t) => {
  const parseNodeFilters = parseNodeFiltersFactory();

  const urlWithoutFilters = `style.scss`;
  const nodeFilters = parseNodeFilters(urlWithoutFilters);

  const expectedResult: any[] = [];

  t.deepEqual(nodeFilters, expectedResult);
});

test(`Should return node filters from URL.`, (t) => {
  const parseNodeFilters = parseNodeFiltersFactory();

  const urlWithFilters = `[at-rules, mixins] from style.scss`;
  const nodeFilters = parseNodeFilters(urlWithFilters);

  const expectedResult = [
    `at-rules`,
    `mixins`,
  ];

  t.deepEqual(nodeFilters, expectedResult);
});

test(`Should trim empty filter from multi line URL.`, (t) => {
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

  t.deepEqual(nodeFilters, expectedResult);
});
