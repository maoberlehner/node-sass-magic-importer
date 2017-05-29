import test from 'ava';
import * as sinon from 'sinon';

import { escapeSelectorFactory } from './escape-selector';

import { processRawSelectorFiltersFactory } from './process-raw-selector-filters';

test.beforeEach((t) => {
  const escapeSelector = escapeSelectorFactory();

  t.context.dep = {
    escapeSelector,
  };
});

test(`Should be a function.`, (t) => {
  const processRawSelectorFilters = processRawSelectorFiltersFactory(
    t.context.dep.escapeSelector,
  );

  t.is(typeof processRawSelectorFilters, `function`);
});

test(`Should escape the selector and replacement.`, (t) => {
  const escapeSelectorStub = sinon.stub(t.context.dep, `escapeSelector`);
  const processRawSelectorFilters = processRawSelectorFiltersFactory(escapeSelectorStub);

  processRawSelectorFilters([{
    selector: `.some-selector`,
    replacement: `.some-replacement`,
  }]);

  t.true(escapeSelectorStub.calledWith(`.some-selector`));
  t.true(escapeSelectorStub.calledWith(`.some-replacement`));
});

test(`Should detect and handle RegExp selectors.`, (t) => {
  const escapeSelectorStub = sinon.stub(t.context.dep, `escapeSelector`);
  const processRawSelectorFilters = processRawSelectorFiltersFactory(escapeSelectorStub);

  processRawSelectorFilters([{ selector: `/regex/i`, replacement: undefined }]);

  t.true(escapeSelectorStub.calledWith(`regex`));
});
