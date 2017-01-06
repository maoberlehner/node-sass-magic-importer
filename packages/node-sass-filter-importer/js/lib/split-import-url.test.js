/* eslint-env node, mocha */
import { expect } from 'chai';

import splitImportUrl from './split-import-url';

describe(`splitImportUrl`, () => {
  it(`should be a function`, () => expect(splitImportUrl).to.be.a(`function`));
  it(`should return an array`, () => expect(splitImportUrl()).to.be.an(`Array`));

  it(`should return the url as first array item`, () => {
    const url = `some/url`;
    expect(splitImportUrl(url)[0]).to.equal(url);
  });

  it(`should return a filter string as second array item`, () => {
    const url = `[variables, mixins] from some/url`;
    expect(splitImportUrl(url)[1]).to.equal(`[variables, mixins]`);
  });
});
