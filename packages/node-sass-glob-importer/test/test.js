const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');
const path = require('path');

const globImporter = require('../');
const GlobImporterClass = require('../dist/GlobImporter.js');

chai.use(chaiAsPromised);

describe('globImporter', () => {
  it('should be a function', () => {
    return expect(globImporter).to.be.a('function');
  });

  it('should resolve glob import', (done) => {
     const expectedResult = fs.readFileSync('test/files/glob-reference.css', { 'encoding': 'utf8' });
     sass.render({
       file: 'test/files/glob.scss',
       importer: globImporter
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

describe('GlobImporterClass', () => {
  it('should be a function', () => {
    return expect(GlobImporterClass).to.be.a('function');
  });

  /**
   * resolve()
   */
  describe('resolve()', () => {
    it('should return null', (done) => {
      const globImporterInstance = new GlobImporterClass();
      const url = 'path/without/glob/pattern.scss';
      const expectedResult = null;
      return expect(globImporterInstance.resolve(url)).to.eventually.deep.equal(expectedResult).notify(done);
    });

    it('should return object with contents property with @import statements', (done) => {
      const globImporterInstance = new GlobImporterClass();
      const url = 'files/test-resolve/**/*.scss';
      const includePath = path.join(process.cwd(), 'test');
      const expectedResult = { contents: `@import '${path.join(includePath, 'files/test-resolve/style1.scss')}';
@import '${path.join(includePath, 'files/test-resolve/style2.scss')}';` };
      return expect(globImporterInstance.resolve(url, [includePath])).to.eventually.deep.equal(expectedResult).notify(done);
    });
  });

  /**
   * importer()
   */
   describe('importer()', () => {
     it('should resolve glob import', (done) => {
       const globImporterInstance = new GlobImporterClass();
       const expectedResult = fs.readFileSync('test/files/glob-reference.css', { 'encoding': 'utf8' });
       sass.render({
         file: 'test/files/glob.scss',
         importer: globImporterInstance.importer()
       }, (error, result) => {
         if (!error) {
           expect(result.css.toString()).to.equal(expectedResult);
           done();
         } else {
           console.log(error);
         }
       });
     });

     it('should resolve glob import with include path', (done) => {
       const globImporterInstance = new GlobImporterClass();
       const expectedResult = fs.readFileSync('test/files/include-path-reference.css', { 'encoding': 'utf8' });
       sass.render({
         file: 'test/files/include-path.scss',
         importer: globImporterInstance.importer(),
         includePaths: [
           'some/other/include-path',
           'test/files/test-imports'
         ],
       }, (error, result) => {
         if (!error) {
           expect(result.css.toString()).to.equal(expectedResult);
           done();
         } else {
           console.log(error);
         }
       });
     });

     it('should resolve glob import with absolute include path', (done) => {
       const globImporterInstance = new GlobImporterClass();
       const expectedResult = fs.readFileSync('test/files/include-path-reference.css', { 'encoding': 'utf8' });
       sass.render({
         file: 'test/files/include-path.scss',
         importer: globImporterInstance.importer(),
         includePaths: [process.cwd() + '/test/files/test-imports'],
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
});
