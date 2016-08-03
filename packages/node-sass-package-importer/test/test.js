const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');
const path = require('path');

const packageImporter = require('../')['default'];
const PackageImporterClass = require('../').PackageImporter;

chai.use(chaiAsPromised);

describe('PackageImporterClass', () => {
  it('should be a function', () => {
    return expect(PackageImporterClass).to.be.a('function');
  });

  /**
   * resolve()
   */
  describe('resolve()', () => {
    it('should return null', (done) => {
      const url = 'path/that/does/not/exist.scss';
      const expectedResult = null;
      return expect(PackageImporterClass.resolve(url)).to.eventually.deep.equal(expectedResult).notify(done);
    });

    it('should return object with @import statement for the test-module main sass file', (done) => {
      const url = 'test-module';
      const includePath = path.join(process.cwd(), 'test/files/test-resolve');
      const expectedResult = { contents: `@import '${path.join(includePath, 'node_modules/test-module/scss/style.scss')}';` };
      return expect(PackageImporterClass.resolve(url, [includePath])).to.eventually.deep.equal(expectedResult).notify(done);
    });

    it('should return object with @import statement for the test-module partial file', (done) => {
      const url = 'test-module/scss/partial';
      const includePath = path.join(process.cwd(), 'test/files/test-resolve');
      const expectedResult = { contents: `@import '${path.join(includePath, 'node_modules/test-module/scss/_partial.scss')}';` };
      return expect(PackageImporterClass.resolve(url, [includePath])).to.eventually.deep.equal(expectedResult).notify(done);
    });
  });

  /**
   * importer()
   */
  //  describe('importer()', () => {
  //    const globImporter = new GlobImporter();
   // 
  //    it('should resolve glob import', (done) => {
  //      const testName = 'globbing';
  //      const expectedResult = fs.readFileSync('test/files/glob-reference.css', { 'encoding': 'utf8' });
  //      sass.render({
  //        file: 'test/files/glob.scss',
  //        importer: globImporter.importer()
  //      }, (error, result) => {
  //        if (!error) {
  //          expect(result.css.toString()).to.equal(expectedResult);
  //          done();
  //        } else {
  //          console.log(error);
  //        }
  //      });
  //    });
   // 
  //    it('should resolve glob import with include path', (done) => {
  //      const testName = 'globbing';
  //      const expectedResult = fs.readFileSync('test/files/include-path-reference.css', { 'encoding': 'utf8' });
  //      sass.render({
  //        file: 'test/files/include-path.scss',
  //        importer: globImporter.importer(),
  //        includePaths: [
  //          'some/other/include-path',
  //          'test/files/test-imports'
  //        ],
  //      }, (error, result) => {
  //        if (!error) {
  //          expect(result.css.toString()).to.equal(expectedResult);
  //          done();
  //        } else {
  //          console.log(error);
  //        }
  //      });
  //    });
   // 
  //    it('should resolve glob import with absolute include path', (done) => {
  //      const testName = 'globbing';
  //      const expectedResult = fs.readFileSync('test/files/include-path-reference.css', { 'encoding': 'utf8' });
  //      sass.render({
  //        file: 'test/files/include-path.scss',
  //        importer: globImporter.importer(),
  //        includePaths: [process.cwd() + '/test/files/test-imports'],
  //      }, (error, result) => {
  //        if (!error) {
  //          expect(result.css.toString()).to.equal(expectedResult);
  //          done();
  //        } else {
  //          console.log(error);
  //        }
  //      });
  //    });
  //  });
});

describe('packageImporter', () => {
  it('should be a function', () => {
    return expect(packageImporter).to.be.a('function');
  });

  it('should resolve module import', (done) => {
     const expectedResult = fs.readFileSync('test/files/module-reference.css', { 'encoding': 'utf8' });
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
