// Spec:
// 1. Url parsing
//    Find extraction patterns, return patterns and cleanUrl
// 2. Globbing
//    Check if the url pattern matches globbing and return content with imports
//    of found urls
// 3. Module importing
//    Find path to module file and return as url (findup / resolve / resolve-dir)
// 4. Once check - ignore if url imported
// 5. Selector filtering
//    Load CSS file and run css-selector-extract on it and return as content
// 6. Once
//    Track imported files and selectors

const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');
const NodeSassMagicImporter = require('../').NodeSassMagicImporter;
const path = require('path');

describe('MagicImporter', function () {
  it('should be a function', () => {
    expect(typeof NodeSassMagicImporter).to.equal('function');
  });

  const nodeSassMagicImporter = new NodeSassMagicImporter();

  describe('#_parseUrl()', function () {
    it('should be a function', () => {
      expect(typeof nodeSassMagicImporter._parseUrl).to.equal('function');
    });

    it('should return an object with expected values', () => {
      let url = '{ .test1 as .test1-replaced, .test2 } from ~style.scss';
      let expectedResult = {
        url: 'style.scss',
        selectorFilters: ['.test1', '.test2'],
        selectorReplacements: { '.test1': '.test1-replaced' },
        prioritizeModuleResolve: true
      };

      expect(nodeSassMagicImporter._parseUrl(url)).to.deep.equal(expectedResult);
    });
  });

  describe('#_resolveGlob()', function () {
    it('should be a function', () => {
      expect(typeof nodeSassMagicImporter._resolveGlob).to.equal('function');
    });

    it('should return error message', (done) => {
      let url = 'style.scss';
      let expectedResult = 'No glob pattern found.';

      nodeSassMagicImporter._resolveGlob(url).then(null, (error) => {
        expect(error).to.equal(expectedResult);
        done();
      });
    });

    it('should return content string with @import statements', () => {
      let url = 'files/resolve-glob/**/*.scss';
      let includePath = path.join(process.cwd(), 'test');
      let expectedResult = `@import '${path.join(includePath, 'files/resolve-glob/style1.scss')}';
@import '${path.join(includePath, 'files/resolve-glob/style2.scss')}';`;

      nodeSassMagicImporter._resolveGlob(url, [includePath]).then(null, (error) => {
        expect(error).to.equal(expectedResult);
        done();
      });
    });
  });

  describe('#_resolveModule()', function () {
    it('should be a function', () => {
      expect(typeof nodeSassMagicImporter._resolveModule).to.equal('function');
    });

    it('should return error message', (done) => {
      let url = 'non-existent-module';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = `Module path "${url}" could not be resolved.`;

      nodeSassMagicImporter._resolveModule(url, cwd).then(null, (error) => {
        expect(error).to.equal(expectedResult);
        done();
      });
    });

    it('should return absolute path to sass file defined in package.json', (done) => {
      let url = 'test-module';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/scss/style.scss');

      nodeSassMagicImporter._resolveModule(url, cwd).then((url) => {
        expect(url).to.equal(expectedResult);
        done();
      });
    });

    it('should return absolute path to sass file', (done) => {
      let url = 'test-module/scss/_partial.scss';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/scss/_partial.scss');

      nodeSassMagicImporter._resolveModule(url, cwd).then((url) => {
        expect(url).to.equal(expectedResult);
        done();
      });
    });

    it('should return absolute path to partial sass file', (done) => {
      let url = 'test-module/scss/partial';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/scss/_partial.scss');

      nodeSassMagicImporter._resolveModule(url, cwd).then((url) => {
        expect(url).to.equal(expectedResult);
        done();
      });
    });

    it('should return absolute path to sass file defined in package.json of nested module', (done) => {
      let url = 'nested-test-module';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/node_modules/nested-test-module/scss/style.scss');

      nodeSassMagicImporter._resolveModule(url, cwd).then((url) => {
        expect(url).to.equal(expectedResult);
        done();
      });
    });

    it('should return absolute path to sass file of nested module', (done) => {
      let url = 'nested-test-module/scss/_partial.scss';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/node_modules/nested-test-module/scss/_partial.scss');

      nodeSassMagicImporter._resolveModule(url, cwd).then((url) => {
        expect(url).to.equal(expectedResult);
        done();
      });
    });

    it('should return absolute path to partial sass file of nested module', (done) => {
      let url = 'nested-test-module/scss/partial';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/node_modules/nested-test-module/scss/_partial.scss');

      nodeSassMagicImporter._resolveModule(url, cwd).then((url) => {
        expect(url).to.equal(expectedResult);
        done();
      });
    });
  });

  describe('#_importOnceTrack()', function () {
  });

  describe('#_importOnceCheck()', function () {
  });

  describe('#_selectorFilter()', function () {
  });

  describe('#importer()', function () {
  });

  // describe('Test imports', function () {
  //   const defaultImportTest = function (testName, done) {
  //     const referenceCss = fs.readFileSync('test/css/' + testName + '-reference.css').toString();

  //     sass.render({
  //       file: 'test/css/' + testName + '.scss',
  //       importer: magicImporter,
  //       magicImporter: {
  //         importOnce: true,
  //         cssImport: true,
  //         extensions: ['.scss']
  //       }
  //     }, function (error, result) {
  //       if (!error) {
  //         expect(result.css.toString()).to.equal(referenceCss);
  //         done();
  //       }
  //     });
  //   }

  //   it('Combined', function (done) {
  //     const testName = 'combined';
  //     defaultImportTest(testName, done);
  //   });

  //   it('CSS', function (done) {
  //     const testName = 'css';
  //     defaultImportTest(testName, done);
  //   });

  //   it('Globbing', function (done) {
  //     const testName = 'globbing';
  //     defaultImportTest(testName, done);
  //   });

  //   it('Module', function (done) {
  //     const testName = 'module';
  //     defaultImportTest(testName, done);
  //   });

  //   it('Once', function (done) {
  //     const testName = 'once';
  //     defaultImportTest(testName, done);
  //   });

  //   it('Selectors', function (done) {
  //     const testName = 'selectors';
  //     defaultImportTest(testName, done);
  //   });
  // });
});
