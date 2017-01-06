/* eslint-env node, mocha */
import { expect } from 'chai';

import parseImportUrl from './parse-import-url';

describe(`parseImportUrl`, () => {
  it(`should be a function`, () => expect(parseImportUrl).to.be.a(`function`));
  it(`should return an object`, () => expect(parseImportUrl()).to.be.an(`Object`));

  it(`should return an object with url and empty filters`, () => {
    const url = `some/url`;
    const importUrlObject = parseImportUrl(url);
    return expect(importUrlObject.url).to.equal(url) &&
      expect(importUrlObject.filters).to.deep.equal([]);
  });

  it(`should return an object with url and filters`, () => {
    const url = `[variables, mixins] from some/url`;
    const importUrlObject = parseImportUrl(url);
    return expect(importUrlObject.url).to.equal(`some/url`) &&
      expect(importUrlObject.filters).to.deep.equal([`variables`, `mixins`]);
  });
});
