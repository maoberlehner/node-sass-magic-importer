import test from 'ava';

import { cleanImportUrlFactory } from './clean-import-url';

test(`Should be a function.`, (t) => {
  const cleanImportUrl = cleanImportUrlFactory();

  t.is(typeof cleanImportUrl, `function`);
});

test(`Should return URL without filters.`, (t) => {
  const cleanImportUrl = cleanImportUrlFactory();

  const urlWithSelectorFilters = `{ .btn, .btn-alert } from style.scss`;
  const urlWithNodeFilters = `[variables, mixins] from style.scss`;
  const urlWithBoth = `[variables, mixins] { .btn, .btn-alert } from style.scss`;
  const urlWithoutFilters = `style.scss`;

  const urlCleanedSelectorFilters = cleanImportUrl(urlWithSelectorFilters);
  const urlCleanedNodeFilters = cleanImportUrl(urlWithNodeFilters);
  const urlCleanedBoth = cleanImportUrl(urlWithBoth);
  const urlCleanedFilters = cleanImportUrl(urlWithoutFilters);

  t.is(urlCleanedSelectorFilters, `style.scss`);
  t.is(urlCleanedNodeFilters, `style.scss`);
  t.is(urlCleanedBoth, `style.scss`);
  t.is(urlCleanedFilters, `style.scss`);
});
