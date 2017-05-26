/* eslint-env node, mocha */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import sinon from 'sinon';
import { expect } from 'chai';

import MagicImporter from '../../js/lib/magic-importer';

/** @test {MagicImporter} */
describe(`MagicImporter`, () => {
  it(`should be a function`, () => expect(MagicImporter).to.be.a(`function`));

  /** @test {MagicImporter#getAbsoluteUrl} */
  describe(`getAbsoluteUrl()`, () => {
    it(`should be a function`, () => {
      const magicImporter = new MagicImporter();
      expect(magicImporter.getAbsoluteUrl).to.be.a(`function`);
    });

    it(`should return absolute URL`, () => {
      const magicImporter = new MagicImporter();
      const url = `test/files/combined.scss`;
      const expectedResult = `${process.cwd()}/test/files/combined.scss`;
      expect(magicImporter.getAbsoluteUrl(url)).to.equal(expectedResult);
    });
  });

  /** @test {MagicImporter#storeAdd} */
  describe(`storeAdd()`, () => {
    it(`should be a function`, () => {
      const magicImporter = new MagicImporter();
      expect(magicImporter.storeAdd).to.be.a(`function`);
    });

    it(`should add an URL to the store`, () => {
      const magicImporter = new MagicImporter();
      const url = `/some/file.scss`;
      magicImporter.storeAdd(url);
      expect(magicImporter.store[1].includes(url)).to.be.true;
    });
  });

  /** @test {MagicImporter#store} */
  describe(`isInStore()`, () => {
    it(`should be a function`, () => {
      const magicImporter = new MagicImporter();
      expect(magicImporter.isInStore).to.be.a(`function`);
    });

    it(`URL is in store, should return true`, () => {
      const magicImporter = new MagicImporter();
      const url = `/some/file.scss`;
      magicImporter.store = { 1: [url] };
      expect(magicImporter.isInStore(url)).to.be.true;
    });

    it(`URL is not in store, should return false`, () => {
      const magicImporter = new MagicImporter();
      const url = `/some/file.scss`;
      expect(magicImporter.isInStore(url)).to.be.false;
    });

    it(`URL is in store but URL has filters, should return false and log a warning`, () => {
      const sinonInstance = sinon.sandbox.create();
      sinonInstance.stub(console, `warn`);
      const magicImporter = new MagicImporter();
      const url = `/some/file.scss`;
      const hasFilters = true;
      magicImporter.store = { 1: [url] };
      expect(magicImporter.isInStore(url, hasFilters)).to.be.false;
      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.calledWith(`Warning: double import of file "/some/file.scss".`)).to.be.true;
      sinonInstance.restore();
    });

    it(`warnings are disabled, should log no warning`, () => {
      const sinonInstance = sinon.sandbox.create();
      sinonInstance.stub(console, `warn`);
      const magicImporter = new MagicImporter({ disableWarnings: true });
      const url = `/some/file.scss`;
      const hasFilters = true;
      magicImporter.store = { 1: [url] };
      expect(magicImporter.isInStore(url, hasFilters)).to.be.false;
      expect(console.warn.calledOnce).to.be.false;
      sinonInstance.restore();
    });
  });

  /** @test {MagicImporter#resolveSync} */
  describe(`resolveSync()`, () => {
    it(`should be a function`, () => {
      const magicImporter = new MagicImporter();
      expect(magicImporter.resolveSync).to.be.a(`function`);
    });
  });

  /** @test {MagicImporter#resolve} */
  describe(`resolve()`, () => {
    it(`should be a function`, () => {
      const magicImporter = new MagicImporter();
      expect(magicImporter.resolve).to.be.a(`function`);
    });
  });
});
