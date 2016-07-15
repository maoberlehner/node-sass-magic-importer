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
//    Load CSS file, run css-selector-extract on it and return as content
// 6. Once
//    Track imported files and selectors

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');
const NodeSassMagicImporter = require('../').NodeSassMagicImporter;
const path = require('path');

chai.use(chaiAsPromised);

describe('MagicImporter', () => {
  it('should be a function', () => {
    expect(NodeSassMagicImporter).to.be.a('function');
  });

  /**
   * _parseUrl()
   */
  describe('#_parseUrl()', () => {
    let nodeSassMagicImporter = new NodeSassMagicImporter();

    it('should be a function', () => {
      expect(nodeSassMagicImporter._parseUrl).to.be.a('function');
    });

    it('should return an object with expected values', (done) => {
      let url = '{ .test1 as .test1-replaced, .test2 } from ~style.scss';
      let expectedResult = {
        url: 'style.scss',
        selectorFilters: ['.test1', '.test2'],
        selectorReplacements: { '.test1': '.test1-replaced' },
        prioritizeModuleResolve: true
      };

      return expect(nodeSassMagicImporter._parseUrl(url)).to.eventually.deep.equal(expectedResult).notify(done);
    });
  });

  /**
   * _resolveGlob()
   */
  describe('#_resolveGlob()', () => {
    let nodeSassMagicImporter = new NodeSassMagicImporter();

    it('should be a function', () => {
      expect(nodeSassMagicImporter._resolveGlob).to.be.a('function');
    });

    it('should return error message', (done) => {
      let url = 'style.scss';
      let expectedResult = 'No glob pattern found.';

      return expect(nodeSassMagicImporter._resolveGlob(url)).to.eventually.be.rejectedWith(expectedResult).notify(done);
    });

    it('should return content string with @import statements', (done) => {
      let url = 'files/resolve-glob/**/*.scss';
      let includePath = path.join(process.cwd(), 'test');
      let expectedResult = `@import '${path.join(includePath, 'files/resolve-glob/style1.scss')}';
@import '${path.join(includePath, 'files/resolve-glob/style2.scss')}';`;

      return expect(nodeSassMagicImporter._resolveGlob(url, [includePath])).to.eventually.equal(expectedResult).notify(done);
    });
  });

  /**
   * _resolveModule()
   */
  describe('#_resolveModule()', () => {
    let nodeSassMagicImporter = new NodeSassMagicImporter();

    it('should be a function', () => {
      expect(nodeSassMagicImporter._resolveModule).to.be.a('function');
    });

    it('should return error message', (done) => {
      let url = 'non-existent-module';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = `Module path "${url}" could not be resolved.`;

      return expect(nodeSassMagicImporter._resolveModule(url, cwd)).to.eventually.be.rejectedWith(expectedResult).notify(done);
    });

    it('should return absolute path to sass file defined in package.json', (done) => {
      let url = 'test-module';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/scss/style.scss');

      return expect(nodeSassMagicImporter._resolveModule(url, cwd)).to.eventually.equal(expectedResult).notify(done);
    });

    it('should return absolute path to sass file', (done) => {
      let url = 'test-module/scss/_partial.scss';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/scss/_partial.scss');

      return expect(nodeSassMagicImporter._resolveModule(url, cwd)).to.eventually.equal(expectedResult).notify(done);
    });

    it('should return absolute path to partial sass file', (done) => {
      let url = 'test-module/scss/partial';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/scss/_partial.scss');

      return expect(nodeSassMagicImporter._resolveModule(url, cwd)).to.eventually.equal(expectedResult).notify(done);
    });

    it('should return absolute path to sass file defined in package.json of nested module', (done) => {
      let url = 'nested-test-module';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/node_modules/nested-test-module/scss/style.scss');

      return expect(nodeSassMagicImporter._resolveModule(url, cwd)).to.eventually.equal(expectedResult).notify(done);
    });

    it('should return absolute path to sass file of nested module', (done) => {
      let url = 'nested-test-module/scss/_partial.scss';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/node_modules/nested-test-module/scss/_partial.scss');

      return expect(nodeSassMagicImporter._resolveModule(url, cwd)).to.eventually.equal(expectedResult).notify(done);
    });

    it('should return absolute path to partial sass file of nested module', (done) => {
      let url = 'nested-test-module/scss/partial';
      let cwd = path.join(process.cwd(), 'test/files/resolve-module');
      let expectedResult = path.join(cwd, 'node_modules/test-module/node_modules/nested-test-module/scss/_partial.scss');

      return expect(nodeSassMagicImporter._resolveModule(url, cwd)).to.eventually.equal(expectedResult).notify(done);
    });
  });

  /**
   * _selectorFilter()
   */
  describe('#_selectorFilter()', () => {
    let nodeSassMagicImporter = new NodeSassMagicImporter();

    it('should be a function', () => {
      expect(nodeSassMagicImporter._selectorFilter).to.be.a('function');
    });

    it('should return error message', (done) => {
      let filePath = '/file/does/not/exist.scss';
      let expectedResult = `File "${filePath}" not found.`;

      return expect(nodeSassMagicImporter._selectorFilter(filePath)).to.eventually.be.rejectedWith(expectedResult).notify(done);
    });

    it('should return filtered content string', (done) => {
      let filePath = path.join(process.cwd(), 'test/files/selector-filter/style.scss');
      let selectorFilters = ['.test-selector1'];
      let selectorReplacements = { '.test-selector1': '.test-selector-replaced1' };
      let expectedResult = fs.readFileSync(path.join(process.cwd(), 'test/files/selector-filter/expected-result.scss'), { encoding: 'utf8' });

      return expect(nodeSassMagicImporter._selectorFilter(filePath, selectorFilters, selectorReplacements)).to.eventually.equal(expectedResult).notify(done);
    });
  });

  /**
   * _importOnceInit()
   */
  describe('#_importOnceInit()', () => {
    let nodeSassMagicImporter = new NodeSassMagicImporter();

    it('should be a function', () => {
      expect(nodeSassMagicImporter._importOnceInit).to.be.a('function');
    });

    it('should set "this.importedStore" to empty object', () => {
      nodeSassMagicImporter._importOnceInit();
      expect(nodeSassMagicImporter.importedStore).to.be.an('object').and.to.be.empty;
    });
  });

  /**
   * _importOnceTrack()
   */
  describe('#_importOnceTrack()', () => {
    let nodeSassMagicImporter = new NodeSassMagicImporter();

    it('should be a function', () => {
      expect(nodeSassMagicImporter._importOnceTrack).to.be.a('function');
    });

    it('should track the imported filePaths and selectorFilters', () => {
      let importerId = 'default';

      let filePath1 = '/test/file.scss';
      let selectorFilters1 = ['.test-selector-foo', '.test-selector-bar'];
      nodeSassMagicImporter._importOnceTrack(filePath1, selectorFilters1, importerId);

      let filePath2 = '/test/file.scss';
      let selectorFilters2 = ['.test-selector-foo', '.test-selector-baz'];
      nodeSassMagicImporter._importOnceTrack(filePath2, selectorFilters2, importerId);

      let filePath3 = '/another/test/file.scss';
      let selectorFilters3 = ['.test-selector-foo'];
      nodeSassMagicImporter._importOnceTrack(filePath3, selectorFilters3, importerId);

      let expectedResult = {
        'default': {
          '/test/file.scss': ['.test-selector-foo', '.test-selector-bar', '.test-selector-baz'],
          '/another/test/file.scss': ['.test-selector-foo']
        }
      };

      expect(nodeSassMagicImporter.importedStore).to.deep.equal(expectedResult);
    });
  });

  /**
   * _importOnceCheck()
   */
  describe('#_importOnceCheck()', () => {
    let nodeSassMagicImporter = new NodeSassMagicImporter();
  });

  /**
   * importer()
   */
  describe('#importer()', () => {
    let nodeSassMagicImporter = new NodeSassMagicImporter();
  });

  // describe('Test imports', () => {
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
