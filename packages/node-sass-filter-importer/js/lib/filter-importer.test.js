/* eslint-env node, mocha */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

import FilterImporter from './filter-importer';

const expect = chai.expect;
chai.use(chaiAsPromised);

/** @test {FilterImporter} */
describe(`FilterImporter`, () => {
  it(`should be a function`, () => expect(FilterImporter).to.be.a(`function`));

  /** @test {FilterImporter#extractFilters} */
  describe(`extractFilters()`, () => {
    it(`should be a function`, () => {
      const filterImporter = new FilterImporter();
      expect(filterImporter.extractFilters).to.be.a(`function`);
    });

    it(`should return null`, () => {
      const filterImporter = new FilterImporter();
      const cleanUrl = `some/url.scss`;
      const filterNames = null;
      const expectedResult = null;
      expect(filterImporter.extractFilters(cleanUrl, filterNames)).to.equal(expectedResult);
    });

    it(`should return filtered contents`, () => {
      const filterImporter = new FilterImporter();
      const cleanUrl = `test/files/test.scss`;
      const filterNames = [
        `variables`,
        `mixins`,
      ];
      const expectedResult = fs.readFileSync(`test/files/combined-reference.scss`, {
        encoding: `utf8`,
      });
      expect(filterImporter.extractFilters(cleanUrl, filterNames)).to.equal(expectedResult);
    });
  });

  /** @test {FilterImporter#resolveSync} */
  describe(`resolveSync()`, () => {
    it(`should be a function`, () => {
      const filterImporter = new FilterImporter();
      expect(filterImporter.resolveSync).to.be.a(`function`);
    });
  });

  /** @test {FilterImporter#resolve} */
  describe(`resolve()`, () => {
    it(`should be a function`, () => {
      const filterImporter = new FilterImporter();
      expect(filterImporter.resolve).to.be.a(`function`);
    });

    it(`should return null`, () => {
      const filterImporter = new FilterImporter();
      const url = `path/without/filters.scss`;
      const expectedResult = null;
      expect(filterImporter.resolve(url)).to.eventually.equal(expectedResult);
    });

    it(`should return filtered contents`, () => {
      const filterImporter = new FilterImporter();
      const url = `[variables, mixins] from test/files/test.scss`;
      const contents = fs.readFileSync(`test/files/combined-reference.scss`, {
        encoding: `utf8`,
      });
      const expectedResult = { contents };
      expect(filterImporter.resolve(url)).to.eventually.deep.equal(expectedResult);
    });
  });
});
