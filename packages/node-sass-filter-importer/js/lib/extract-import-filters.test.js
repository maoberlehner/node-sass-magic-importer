/* eslint-env node, mocha */
import { expect } from 'chai';

import extractImportFilters from './extract-import-filters';

describe(`extractImportFilters`, () => {
  it(`should be a function`, () => expect(extractImportFilters).to.be.a(`function`));
  it(`should return an empty array`, () => expect(extractImportFilters(`some/url`)).to.be.an(`Array`));

  it(`should return an array of filters`, () => {
    const string = `[variables, mixins] from some/url`;
    expect(extractImportFilters(string)).to.deep.equal([`variables`, `mixins`]);
  });
});
