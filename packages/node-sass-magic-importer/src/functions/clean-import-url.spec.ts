import { cleanImportUrlFactory } from './clean-import-url';

describe(`cleanImportUrl()`, () => {
  test(`It should be a function.`, () => {
    const cleanImportUrl = cleanImportUrlFactory();

    expect(typeof cleanImportUrl).toBe(`function`);
  });

  test(`It should return URL without filters.`, () => {
    const cleanImportUrl = cleanImportUrlFactory();

    const urlWithSelectorFilters = `{ .btn, .btn-alert } from style.scss`;
    const urlWithNodeFilters = `[variables, mixins] from style.scss`;
    const urlWithBoth = `[variables, mixins] { .btn, .btn-alert } from style.scss`;
    const urlWithoutFilters = `style.scss`;

    const urlCleanedSelectorFilters = cleanImportUrl(urlWithSelectorFilters);
    const urlCleanedNodeFilters = cleanImportUrl(urlWithNodeFilters);
    const urlCleanedBoth = cleanImportUrl(urlWithBoth);
    const urlCleanedFilters = cleanImportUrl(urlWithoutFilters);

    expect(urlCleanedSelectorFilters).toBe(`style.scss`);
    expect(urlCleanedNodeFilters).toBe(`style.scss`);
    expect(urlCleanedBoth).toBe(`style.scss`);
    expect(urlCleanedFilters).toBe(`style.scss`);
  });
});
