/* eslint-env node, mocha */
/* eslint-disable no-console */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');

const selectorImporter = require('../');
const SelectorImporterClass = require('../dist/SelectorImporter.js');

chai.use(chaiAsPromised);

/** @test {index} */
describe('selectorImporter', () => {
  it('should be a function', () => expect(selectorImporter).to.be.a('function'));

  it('should resolve selector import', (done) => {
    const expectedResult = fs.readFileSync('test/files/importer-reference.css', {
      encoding: 'utf8'
    });
    sass.render({
      file: 'test/files/importer.scss',
      importer: selectorImporter
    }, (error, result) => {
      if (!error) {
        expect(result.css.toString()).to.equal(expectedResult);
        done();
      } else {
        console.log(error);
      }
    });
  });
});

/** @test {SelectorImporter} */
describe('SelectorImporterClass', () => {
  it('should be a function', () => expect(SelectorImporterClass).to.be.a('function'));

  /** @test {SelectorImporter#cleanUrl} */
  describe('cleanUrl()', () => {
    it('should return the url unmodified', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'normal/path/without/tilde';
      const expectedResult = url;
      return expect(selectorImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });

    it('should return the unmodified home path relative url', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = '~/home/path/with/tilde';
      const expectedResult = url;
      return expect(selectorImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });

    it('should return a cleaned up url without tilde', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = '~path/with/tilde';
      const expectedResult = 'path/with/tilde';
      return expect(selectorImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });
  });

  /** @test {SelectorImporter#parseUrl} */
  describe('parseUrl()', () => {
    it('should return object with url and empty selector filters', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'path/without/selector/filters.scss';
      const expectedResult = {
        url,
        selectorFilters: undefined
      };
      return expect(selectorImporterInstance.parseUrl(url)).to.deep.equal(expectedResult);
    });

    it('should return object with url and selector filters', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'path/with/selector/filters.scss';
      const selectorFilters = [
        ['.selector1'],
        ['.selector2']
      ];
      const selectorFilterString = selectorFilters.map((x) => x.join(' as ')).join(', ');
      const urlWithSelectorFilters = `{ ${selectorFilterString} } from ${url}`;
      const expectedResult = {
        url,
        selectorFilters
      };
      return expect(selectorImporterInstance.parseUrl(urlWithSelectorFilters))
        .to.deep.equal(expectedResult);
    });

    it('should return object with url and selector filters with replacements', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'path/with/selector/filters/and/replacements.scss';
      const selectorFilters = [
        ['.selector1', '.replacement1'],
        ['.selector2', '.replacement1']
      ];
      const selectorFilterString = selectorFilters.map((x) => x.join(' as ')).join(', ');
      const urlWithSelectorFilters = `{ ${selectorFilterString} } from ${url}`;
      const expectedResult = {
        url,
        selectorFilters
      };
      return expect(selectorImporterInstance.parseUrl(urlWithSelectorFilters))
        .to.deep.equal(expectedResult);
    });
  });

  /** @test {SelectorImporter#resolve} */
  describe('resolve()', () => {
    it('should return null', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'path/without/selector/filters.scss';
      const expectedResult = null;
      return expect(selectorImporterInstance.resolve(url)).to.eventually.equal(expectedResult);
    });

    it('should return selector filtered contents', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = '{ .class1 as .class-1, .class3 as .class-3 } from test/files/resolve.scss';
      const expectedResult = fs.readFileSync('test/files/resolve-reference.css', {
        encoding: 'utf8'
      });
      return expect(selectorImporterInstance.resolve(url)).to.eventually.equal(expectedResult);
    });
  });
});
