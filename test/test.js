/* eslint-env node, mocha */
/* eslint-disable no-console */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');

const magicImporter = require('../');
const MagicImporterClass = require('../dist/MagicImporter.js');

chai.use(chaiAsPromised);

/** @test {index} */
describe('magicImporter', () => {
  it('should be a function', () => expect(magicImporter).to.be.a('function'));

  it('should convert a SASS file successfully to CSS', (done) => {
    const expectedResult = fs.readFileSync('test/files/combined-reference.css', {
      encoding: 'utf8'
    });
    sass.render({
      file: 'test/files/combined.scss',
      importer: magicImporter
    }, (error, result) => {
      if (!error) {
        expect(result.css.toString()).to.equal(expectedResult);
        done();
      } else {
        console.log(error);
      }
    });
  });

  it('should compile bootstrap', (done) => {
    sass.render({
      file: 'test/files/bootstrap.scss',
      importer: magicImporter
    }, (error) => {
      if (!error) {
        done();
      } else {
        console.log(error);
      }
    });
  });

  it('should compile foundation', (done) => {
    sass.render({
      file: 'test/files/foundation.scss',
      importer: magicImporter
    }, (error) => {
      if (!error) {
        done();
      } else {
        console.log(error);
      }
    });
  });
});

/** @test {MagicImporter} */
describe('SelectorImporterClass', () => {
  it('should be a function', () => expect(MagicImporterClass).to.be.a('function'));

  /** @test {MagicImporter#store} */
  describe('store()', () => {
    it('should be a function', () => {
      const magicImporterInstance = new MagicImporterClass();
      expect(magicImporterInstance.store).to.be.a('function');
    });

    // New url not in store: put url in store.
    it('should put the URL in the store', () => {
      const magicImporterInstance = new MagicImporterClass();
      const url = '/some/random/url.scss';
      const expectedOnceStoreState = {};
      expectedOnceStoreState[url] = null;

      magicImporterInstance.store(url);
      return expect(magicImporterInstance.onceStore).to.deep.equal(expectedOnceStoreState);
    });

    // Url in store without filters, new url without filters: do not load.
    it('should return false', () => {
      const magicImporterInstance = new MagicImporterClass();
      const url = '/some/random/url.scss';
      const expectedResult = false;

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = null;
      return expect(magicImporterInstance.store(url)).to.equal(expectedResult);
    });

    // Url in store without filters, new url with filters; load (maybe add console warning).
    it('should return URL and selector filters in an object', () => {
      const magicImporterInstance = new MagicImporterClass();
      const url = '/some/random/url.scss';
      const selectorFilters = [
        ['.selector-a'],
        ['.selector-b']
      ];
      const expectedResult = {
        url,
        selectorFilters
      };

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = null;
      return expect(magicImporterInstance.store(url, selectorFilters))
        .to.deep.equal(expectedResult);
    });

    // Url in store with filters, new url without filters: load and remove filters from store (maybe add console warning).
    it('should remove filters from stored URL and return URL in an object', () => {
      const magicImporterInstance = new MagicImporterClass();
      const url = '/some/random/url.scss';
      const selectorFilters = null;
      const storedSelectorFilters = [
        ['.selector-a'],
        ['.selector-b']
      ];
      const expectedResult = {
        url,
        selectorFilters
      };
      const expectedOnceStoreState = {};
      expectedOnceStoreState[url] = null;

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = storedSelectorFilters;

      const resultTest = expect(magicImporterInstance.store(url, selectorFilters))
        .to.deep.equal(expectedResult);
      const stateTest = expect(magicImporterInstance.onceStore)
        .to.deep.equal(expectedOnceStoreState);
      return resultTest && stateTest;
    });

    // Url in store with filters, new url with same and other filters: only load other filters, concat-once filters.
    it('should return URL and concatenated selector filters in an object', () => {
      const magicImporterInstance = new MagicImporterClass();
      const url = '/some/random/url.scss';
      const selectorFilters = [
        ['.selector-a'],
        ['.selector-c'],
        ['.selector-d']
      ];
      const expectedSelectorFilters = [
        ['.selector-c'],
        ['.selector-d']
      ];
      const storedSelectorFilters = [
        ['.selector-a'],
        ['.selector-b']
      ];
      const expectedStoredSelectorFilters = [
        ['.selector-a'],
        ['.selector-b'],
        ['.selector-c'],
        ['.selector-d']
      ];
      const expectedResult = {
        url,
        selectorFilters: expectedSelectorFilters
      };
      const expectedOnceStoreState = {};
      expectedOnceStoreState[url] = expectedStoredSelectorFilters;

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = storedSelectorFilters;

      const resultTest = expect(magicImporterInstance.store(url, selectorFilters))
        .to.deep.equal(expectedResult);
      const stateTest = expect(magicImporterInstance.onceStore)
        .to.deep.equal(expectedOnceStoreState);
      return resultTest && stateTest;
    });

    // Url in store with filters, new url with same filters: do not load.
    it('should return false', () => {
      const magicImporterInstance = new MagicImporterClass();
      const url = '/some/random/url.scss';
      const selectorFilters = [
        ['.selector-a'],
        ['.selector-b']
      ];
      const storedSelectorFilters = selectorFilters;
      const expectedResult = false;

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = storedSelectorFilters;
      return expect(magicImporterInstance.store(url, selectorFilters)).to.equal(expectedResult);
    });
  });

  /** @test {MagicImporter#resolveSync} */
  describe('resolveSync()', () => {
    it('should be a function', () => {
      const magicImporterInstance = new MagicImporterClass();
      expect(magicImporterInstance.resolveSync).to.be.a('function');
    });
  });

  /** @test {MagicImporter#resolve} */
  describe('resolve()', () => {
    it('should be a function', () => {
      const magicImporterInstance = new MagicImporterClass();
      expect(magicImporterInstance.resolve).to.be.a('function');
    });
  });
});

