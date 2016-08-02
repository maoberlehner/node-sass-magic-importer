const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');
const path = require('path');

const GlobImporter = require('../').GlobImporter;

chai.use(chaiAsPromised);

describe('GlobImporter', () => {
  it('should be a function', () => {
    return expect(GlobImporter).to.be.a('function');
  });

  /**
   * resolve()
   */
  describe('resolve()', () => {
    it('should return null', (done) => {
      const url = 'path/without/glob/pattern.js';
      const expectedResult = null;
      return expect(GlobImporter.resolve(url)).to.eventually.deep.equal(expectedResult).notify(done);
    });

    it('should return object with contents property with @import statements', (done) => {
      const url = 'files/test-resolve/**/*.scss';
      const includePath = path.join(process.cwd(), 'test');
      const expectedResult = { contents: `@import '${path.join(includePath, 'files/test-resolve/style1.scss')}';
@import '${path.join(includePath, 'files/test-resolve/style2.scss')}';` };
      return expect(GlobImporter.resolve(url, [includePath])).to.eventually.deep.equal(expectedResult).notify(done);
    });
  });

  /**
   * importer()
   */
   describe('importer()', () => {
     const globImporter = new GlobImporter();

     it('should resolve glob import', (done) => {
       const testName = 'globbing';
       const expectedResult = fs.readFileSync('test/files/glob-reference.css', { 'encoding': 'utf8' });
       sass.render({
         file: 'test/files/glob.scss',
         importer: globImporter.importer()
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
       const testName = 'globbing';
       const expectedResult = fs.readFileSync('test/files/include-path-reference.css', { 'encoding': 'utf8' });
       sass.render({
         file: 'test/files/include-path.scss',
         importer: globImporter.importer(),
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
       const testName = 'globbing';
       const expectedResult = fs.readFileSync('test/files/include-path-reference.css', { 'encoding': 'utf8' });
       sass.render({
         file: 'test/files/include-path.scss',
         importer: globImporter.importer(),
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
