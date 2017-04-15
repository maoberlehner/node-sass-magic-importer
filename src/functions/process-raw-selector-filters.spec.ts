import test from 'ava';
import * as sinon from 'sinon';

import escapeSelector from './escape-selector';

import { IDependencies, processRawSelectorFiltersFactory } from './process-raw-selector-filters';

test.beforeEach((t) => {
  t.context.dependencies = {
    escapeSelector,
  } as IDependencies;
});

test(`Should be a function.`, (t) => {
  const processRawSelectorFilters = processRawSelectorFiltersFactory(t.context.dependencies);

  t.is(typeof processRawSelectorFilters, `function`);
});

test(`Should escape the selector and replacement.`, (t) => {
  const escapeSelectorStub = sinon.spy();
  const dependencies = Object.assign(
    t.context.dependencies,
    { escapeSelector: escapeSelectorStub },
  );
  const processRawSelectorFilters = processRawSelectorFiltersFactory(dependencies);

  processRawSelectorFilters([{
    selector: `.some-selector`,
    replacement: `.some-replacement`,
  }]);

  t.true(escapeSelectorStub.calledWith(`.some-selector`));
  t.true(escapeSelectorStub.calledWith(`.some-replacement`));
});

test(`Should detect and handle RegExp selectors.`, (t) => {
  const escapeSelectorStub = sinon.spy();
  const dependencies = Object.assign(
    t.context.dependencies,
    { escapeSelector: escapeSelectorStub },
  );
  const processRawSelectorFilters = processRawSelectorFiltersFactory(dependencies);

  processRawSelectorFilters([{ selector: `/regex/i`, replacement: undefined }]);

  t.true(escapeSelectorStub.calledWith(`regex`));
});
