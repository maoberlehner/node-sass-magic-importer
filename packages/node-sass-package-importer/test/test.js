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

describe('PackageImporterClass', () => {
  it('should be a function', () => {
    return expect(PackageImporterClass).to.be.a('function');
  });

  /**
   * resolve()
   */
  describe('resolve()', () => {
    it('should return null', (done) => {
      const packageImporterInstance = new PackageImporterClass();
      const url = 'path/that/does/not/exist.scss';
      const expectedResult = null;
      return expect(packageImporterInstance.resolve(url)).to.eventually.deep.equal(expectedResult).notify(done);
    });

    it('should return url for the test-module main sass file', (done) => {
      const options = { cwd: path.join(process.cwd(), 'test/files') };
      const packageImporterInstance = new PackageImporterClass(options);
      const url = 'test-module';
      const expectedResult = { file: `${path.join(options.cwd, 'node_modules/test-module/scss/style.scss')}` };
      return expect(packageImporterInstance.resolve(url)).to.eventually.deep.equal(expectedResult).notify(done);
    });

    it('should return url for the test-module partial file', (done) => {
      const options = { cwd: path.join(process.cwd(), 'test/files') };
      const packageImporterInstance = new PackageImporterClass(options);
      const url = 'test-module/scss/partial';
      const expectedResult = { file: `${path.join(options.cwd, 'node_modules/test-module/scss/_partial.scss')}` };
      return expect(packageImporterInstance.resolve(url)).to.eventually.deep.equal(expectedResult).notify(done);
    });
  });
});
