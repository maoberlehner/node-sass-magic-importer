// TODO remove sinon dependency

import { escapeSelectorFactory } from './escape-selector';

import { processRawSelectorFiltersFactory } from './process-raw-selector-filters';

const escapeSelector = escapeSelectorFactory();

let dependencies: any;

describe(`processRawSelectorFilters()`, () => {
  beforeEach(() => {
    dependencies = {
      escapeSelector,
    };
  });

  test(`It should be a function.`, () => {
    const processRawSelectorFilters = processRawSelectorFiltersFactory(
      dependencies.escapeSelector,
    );

    expect(typeof processRawSelectorFilters).toBe(`function`);
  });

  test(`It should escape the selector and replacement.`, () => {
    const escapeSelectorMock = jest.fn();
    const processRawSelectorFilters = processRawSelectorFiltersFactory(escapeSelectorMock);

    processRawSelectorFilters([{
      selector: `.some-selector`,
      replacement: `.some-replacement`,
    }]);

    expect(escapeSelectorMock).toBeCalledWith(`.some-selector`);
    expect(escapeSelectorMock).toBeCalledWith(`.some-replacement`);
  });

  test(`It should detect and handle RegExp selectors.`, () => {
    const escapeSelectorMock = jest.fn();
    const processRawSelectorFilters = processRawSelectorFiltersFactory(escapeSelectorMock);

    processRawSelectorFilters([{ selector: `/regex/i`, replacement: undefined }]);

    expect(escapeSelectorMock).toBeCalledWith(`regex`, `\\\\`);
  });
});
