/* eslint-env node, mocha */
import { expect } from 'chai';

import MagicImporter from '../../js/lib/magic-importer';

/** @test {MagicImporter} */
describe(`MagicImporter`, () => {
  it(`should be a function`, () => expect(MagicImporter).to.be.a(`function`));

  /** @test {MagicImporter#getAbsoluteUrl} */
  describe(`getAbsoluteUrl()`, () => {
    it(`should be a function`, () => {
      const magicImporterInstance = new MagicImporter();
      expect(magicImporterInstance.getAbsoluteUrl).to.be.a(`function`);
    });

    it(`should return absolute URL`, () => {
      const magicImporterInstance = new MagicImporter();
      const url = `test/files/combined.scss`;
      const expectedResult = `${process.cwd()}/test/files/combined.scss`;
      expect(magicImporterInstance.getAbsoluteUrl(url)).to.equal(expectedResult);
    });
  });

  /** @test {MagicImporter#store} */
  describe(`store()`, () => {
    it(`should be a function`, () => {
      const magicImporterInstance = new MagicImporter();
      expect(magicImporterInstance.store).to.be.a(`function`);
    });

    // URL is not in store: store and load the URL.
    it(`should put the URL in the store`, () => {
      const magicImporterInstance = new MagicImporter();
      const url = `/some/random/url.scss`;
      const expectedOnceStoreState = {};
      expectedOnceStoreState[url] = null;

      magicImporterInstance.store(url);
      expect(magicImporterInstance.onceStore).to.deep.equal(expectedOnceStoreState);
    });

    // URL is in store without filters, no filters given: do not load the URL.
    it(`should return false`, () => {
      const magicImporterInstance = new MagicImporter();
      const url = `/some/random/url.scss`;
      const expectedResult = false;

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = null;
      expect(magicImporterInstance.store(url)).to.equal(expectedResult);
    });

    // URL is in store without filters, filters given: load the URL.
    it(`should return URL and selector filters in an object`, () => {
      const magicImporterInstance = new MagicImporter();
      const url = `/some/random/url.scss`;
      const selectorFilters = [
        [`.selector-a`],
        [`.selector-b`],
      ];
      const expectedResult = {
        url,
        selectorFilters,
      };

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = null;
      expect(magicImporterInstance.store(url, selectorFilters))
        .to.deep.equal(expectedResult);
    });

    // URL and filters in store, URL without filters given:
    // load and remove filters from store.
    it(`should remove filters from stored URL and return URL in an object`, () => {
      const magicImporterInstance = new MagicImporter();
      const url = `/some/random/url.scss`;
      const selectorFilters = null;
      const storedSelectorFilters = [
        [`.selector-a`],
        [`.selector-b`],
      ];
      const expectedResult = {
        url,
        selectorFilters,
      };
      const expectedOnceStoreState = {};
      expectedOnceStoreState[url] = null;

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = storedSelectorFilters;

      expect(magicImporterInstance.store(url, selectorFilters))
        .to.deep.equal(expectedResult);
      expect(magicImporterInstance.onceStore)
        .to.deep.equal(expectedOnceStoreState);
    });

    // URL and filters in store, URL with same and other filters given:
    // only load other filters that not already are stored.
    it(`should return URL and concatenated selector filters in an object`, () => {
      const magicImporterInstance = new MagicImporter();
      const url = `/some/random/url.scss`;
      const selectorFilters = [
        [`.selector-a`],
        [`.selector-c`],
        [`.selector-d`],
      ];
      const expectedSelectorFilters = [
        [`.selector-c`],
        [`.selector-d`],
      ];
      const storedSelectorFilters = [
        [`.selector-a`],
        [`.selector-b`],
      ];
      const expectedStoredSelectorFilters = [
        [`.selector-a`],
        [`.selector-b`],
        [`.selector-c`],
        [`.selector-d`],
      ];
      const expectedResult = {
        url,
        selectorFilters: expectedSelectorFilters,
      };
      const expectedOnceStoreState = {};
      expectedOnceStoreState[url] = expectedStoredSelectorFilters;

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = storedSelectorFilters;

      expect(magicImporterInstance.store(url, selectorFilters))
        .to.deep.equal(expectedResult);
      expect(magicImporterInstance.onceStore)
        .to.deep.equal(expectedOnceStoreState);
    });

    // URL and filters in store, URL and same filters given: do not load.
    it(`should return false`, () => {
      const magicImporterInstance = new MagicImporter();
      const url = `/some/random/url.scss`;
      const selectorFilters = [
        [`.selector-a`],
        [`.selector-b`],
      ];
      const storedSelectorFilters = selectorFilters;
      const expectedResult = false;

      magicImporterInstance.onceStore = {};
      magicImporterInstance.onceStore[url] = storedSelectorFilters;
      expect(magicImporterInstance.store(url, selectorFilters)).to.equal(expectedResult);
    });
  });

  /** @test {MagicImporter#resolveSync} */
  describe(`resolveSync()`, () => {
    it(`should be a function`, () => {
      const magicImporterInstance = new MagicImporter();
      expect(magicImporterInstance.resolveSync).to.be.a(`function`);
    });
  });

  /** @test {MagicImporter#resolve} */
  describe(`resolve()`, () => {
    it(`should be a function`, () => {
      const magicImporterInstance = new MagicImporter();
      expect(magicImporterInstance.resolve).to.be.a(`function`);
    });
  });
});
