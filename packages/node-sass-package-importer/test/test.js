/* eslint-env node, mocha */
/* eslint-disable no-console */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');
const path = require('path');

const packageImporter = require('../');
const PackageImporterClass = require('../dist/PackageImporter.js');

chai.use(chaiAsPromised);

describe('packageImporter', () => {
  it('should be a function', () => expect(packageImporter).to.be.a('function'));

  it('should resolve module import', (done) => {
    const expectedResult = fs.readFileSync('test/files/module-reference.css', {
      encoding: 'utf8'
    });
    sass.render({
      file: 'test/files/module.scss',
      importer: packageImporter
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

describe('PackageImporterClass', () => {
  it('should be a function', () => expect(PackageImporterClass).to.be.a('function'));

  /**
   * resolve()
   */
  describe('resolve()', () => {
    it('should return null', (done) => {
      const packageImporterInstance = new PackageImporterClass();
      const url = 'path/that/does/not/exist.scss';
      const expectedResult = null;
      return expect(packageImporterInstance.resolve(url))
        .to.eventually.equal(expectedResult)
        .notify(done);
    });

    it('should return url for the test-module main sass file', (done) => {
      const options = { cwd: path.join(process.cwd(), 'test/files') };
      const packageImporterInstance = new PackageImporterClass(options);
      const url = 'test-module';
      const expectedResult = `${path.join(
        options.cwd,
        'node_modules/test-module/scss/style.scss'
      )}`;
      return expect(packageImporterInstance.resolve(url))
        .to.eventually.equal(expectedResult)
        .notify(done);
    });

    it('should return url for the test-module partial file', (done) => {
      const options = { cwd: path.join(process.cwd(), 'test/files') };
      const packageImporterInstance = new PackageImporterClass(options);
      const url = 'test-module/scss/partial';
      const expectedResult = `${path.join(
        options.cwd,
        'node_modules/test-module/scss/_partial.scss'
      )}`;
      return expect(packageImporterInstance.resolve(url))
        .to.eventually.equal(expectedResult)
        .notify(done);
    });
  });

  /**
   * cleanUrl()
   */
  describe('cleanUrl()', () => {
    it('should return the url unmodified', () => {
      const packageImporterInstance = new PackageImporterClass();
      const url = 'normal/path/without/tilde';
      const expectedResult = url;
      return expect(packageImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });

    it('should return the unmodified home path relative url', () => {
      const packageImporterInstance = new PackageImporterClass();
      const url = '~/home/path/with/tilde';
      const expectedResult = url;
      return expect(packageImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });

    it('should return a cleaned up url without tilde', () => {
      const packageImporterInstance = new PackageImporterClass();
      const url = '~path/with/tilde';
      const expectedResult = 'path/with/tilde';
      return expect(packageImporterInstance.cleanUrl(url)).to.equal(expectedResult);
    });
  });

  /**
   * urlVariants()
   */
  describe('urlVariants()', () => {
    it('should return array with single url (module name)', () => {
      const packageImporterInstance = new PackageImporterClass();
      const url = 'module-name-url';
      const expectedResult = [url];
      return expect(packageImporterInstance.urlVariants(url)).to.deep.equal(expectedResult);
    });

    it('should return array with single url (specific file)', () => {
      const packageImporterInstance = new PackageImporterClass();
      const url = 'module-name/specific/file.scss';
      const expectedResult = [url];
      return expect(packageImporterInstance.urlVariants(url)).to.deep.equal(expectedResult);
    });

    it('should return array with partial file naming variants and extensions', () => {
      const packageImporterInstance = new PackageImporterClass();
      const url = 'module-name/partial/file';
      const expectedResult = [
        url,
        'module-name/partial/file.scss',
        'module-name/partial/_file.scss',
        'module-name/partial/file.sass',
        'module-name/partial/_file.sass'
      ];
      return expect(packageImporterInstance.urlVariants(url)).to.deep.equal(expectedResult);
    });
  });

  /**
   * resolveFilter()
   */
  describe('resolveFilter()', () => {
    it('should return package object with value from `sass` as value for `main`', () => {
      const packageImporterInstance = new PackageImporterClass();
      const pkg = {
        main: 'index.js',
        sass: 'sass.scss',
        scss: 'scss.scss'
      };
      const expectedResult = {
        main: 'sass.scss',
        sass: 'sass.scss',
        scss: 'scss.scss'
      };
      return expect(packageImporterInstance.resolveFilter(pkg)).to.deep.equal(expectedResult);
    });

    it('should return package object with value from `scss` as value for `main`', () => {
      const packageImporterInstance = new PackageImporterClass();
      const pkg = {
        main: 'index.js',
        scss: 'scss.scss'
      };
      const expectedResult = {
        main: 'scss.scss',
        scss: 'scss.scss'
      };
      return expect(packageImporterInstance.resolveFilter(pkg)).to.deep.equal(expectedResult);
    });
  });
});
