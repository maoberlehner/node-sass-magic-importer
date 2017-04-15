import test from 'ava';

import processRawSelectorFilters from './process-raw-selector-filters';
import splitSelectorFilter from './split-selector-filter';

import { IDependencies, parseSelectorFiltersFactory } from './parse-selector-filters';

test.beforeEach((t) => {
  t.context.dependencies = {
    processRawSelectorFilters,
    splitSelectorFilter,
  } as IDependencies;
});

test(`Should be a function.`, (t) => {
  const parseSelectorFilters = parseSelectorFiltersFactory(t.context.dependencies);

  t.is(typeof parseSelectorFilters, `function`);
});

test(`Should return an empty array if no filters were found.`, (t) => {
  const parseSelectorFilters = parseSelectorFiltersFactory(t.context.dependencies);

  const urlWithoutFilters = `style.scss`;
  const selectorFilters = parseSelectorFilters(urlWithoutFilters);

  const expectedResult: any[] = [];

  t.deepEqual(selectorFilters, expectedResult);
});

test(`Should return selector filters from URL.`, (t) => {
  const parseSelectorFilters = parseSelectorFiltersFactory(t.context.dependencies);

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

  t.deepEqual(selectorFilters, expectedResult);
});

test(`Should return selector filters and replacements from URL.`, (t) => {
  const parseSelectorFilters = parseSelectorFiltersFactory(t.context.dependencies);

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

  t.deepEqual(selectorFilters, expectedResult);
});

test(`Should handle special characters.`, (t) => {
  const parseSelectorFilters = parseSelectorFiltersFactory(t.context.dependencies);

  const urlWithFilters = `{ .btn@m as .button@m } from style.scss`;
  const selectorFilters = parseSelectorFilters(urlWithFilters);

  const expectedResult = [
    {
      replacement: `.button\\@m`,
      selector: `.btn\\@m`,
    },
  ];

  t.deepEqual(selectorFilters, expectedResult);
});

test(`Should handle regular expressions.`, (t) => {
  const parseSelectorFilters = parseSelectorFiltersFactory(t.context.dependencies);

  const urlWithFilters = `{ /^\\.btn(.*)/i as .button$1 } from style.scss`;
  const selectorFilters = parseSelectorFilters(urlWithFilters);

  const expectedResult = [
    {
      replacement: `.button$1`,
      selector: /^\.btn(.*)/i,
    },
  ];

  t.deepEqual(selectorFilters, expectedResult);
});
