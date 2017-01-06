/* eslint-env node, mocha */
import { expect } from 'chai';

import cleanImportUrl from './clean-import-url';

describe(`cleanImportUrl`, () => {
  it(`should be a function`, () => expect(cleanImportUrl).to.be.a(`function`));
  it(`should return a string`, () => expect(cleanImportUrl()).to.be.a(`String`));

  it(`should return the url that was given`, () => {
    const url = `some/url`;
    expect(cleanImportUrl(url)).to.equal(url);
  });

  it(`should return the url without filter string`, () => {
    const url = `[variables, mixins] from some/url`;
    expect(cleanImportUrl(url)).to.equal(`some/url`);
  });
});
