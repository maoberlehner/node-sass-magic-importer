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

  it('should resolve selector import asynchronously', (done) => {
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

  it('should resolve selector import synchronously', () => {
    const expectedResult = fs.readFileSync('test/files/importer-reference.css', {
      encoding: 'utf8'
    });
    const result = sass.renderSync({
      file: 'test/files/importer.scss',
      importer: selectorImporter
    });
    expect(result.css.toString()).to.equal(expectedResult);
  });
});

/** @test {SelectorImporter} */
describe('SelectorImporterClass', () => {
  it('should be a function', () => expect(SelectorImporterClass).to.be.a('function'));

  /** @test {SelectorImporter#parseUrl} */
  describe('parseUrl()', () => {
    it('should be a function', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      expect(selectorImporterInstance.parseUrl).to.be.a('function');
    });

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
        {
          selector: '.selector1',
          replacement: undefined
        },
        {
          selector: '.selector2',
          replacement: undefined
        }
      ];
      const urlWithSelectorFilters = `{ .selector1, .selector2 } from ${url}`;
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
        {
          selector: '.selector1',
          replacement: '.replacement1'
        },
        {
          selector: '.selector2',
          replacement: '.replacement2'
        }
      ];
      const urlWithSelectorFilters = `{ .selector1 as .replacement1, .selector2 as .replacement2 } from ${url}`; // eslint-disable-line max-len
      const expectedResult = {
        url,
        selectorFilters
      };
      return expect(selectorImporterInstance.parseUrl(urlWithSelectorFilters))
        .to.deep.equal(expectedResult);
    });

    it('should return object with url and RegEx selector filters', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const url = 'path/with/regex/selector/filters.scss';
      const selectorFilters = [
        {
          selector: /\.selector1/i,
          replacement: undefined
        },
        {
          selector: /\.selector2/,
          replacement: undefined
        }
      ];
      const urlWithSelectorFilters = `{ /\\.selector1/i, /\\.selector2/ } from ${url}`;
      const expectedResult = {
        url,
        selectorFilters
      };
      return expect(selectorImporterInstance.parseUrl(urlWithSelectorFilters))
        .to.deep.equal(expectedResult);
    });
  });

  /** @test {SelectorImporter#extractSelectors} */
  describe('extractSelectors()', () => {
    it('should be a function', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      expect(selectorImporterInstance.extractSelectors).to.be.a('function');
    });

    it('should return null', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const cleanUrl = 'some/url.scss';
      const selectorFilters = null;
      const expectedResult = null;
      return expect(selectorImporterInstance.extractSelectors(cleanUrl, selectorFilters))
        .to.equal(expectedResult);
    });

    it('should return selector filtered contents', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      const cleanUrl = 'test/files/resolve.scss';
      const selectorFilters = [
        {
          selector: '.class1',
          replacement: '.class-1'
        },
        {
          selector: '.class3',
          replacement: '.class-3'
        }
      ];
      const expectedResult = fs.readFileSync('test/files/resolve-reference.css', {
        encoding: 'utf8'
      });
      return expect(selectorImporterInstance.extractSelectors(cleanUrl, selectorFilters))
        .to.equal(expectedResult);
    });
  });

  /** @test {SelectorImporter#resolveSync} */
  describe('resolveSync()', () => {
    it('should be a function', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      expect(selectorImporterInstance.resolveSync).to.be.a('function');
    });
  });

  /** @test {SelectorImporter#resolve} */
  describe('resolve()', () => {
    it('should be a function', () => {
      const selectorImporterInstance = new SelectorImporterClass();
      expect(selectorImporterInstance.resolve).to.be.a('function');
    });

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
