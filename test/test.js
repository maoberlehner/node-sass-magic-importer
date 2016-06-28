const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');
const magicImporter = require('../');

const defaultTest = function (testName, done) {
  const referenceCss = fs.readFileSync('test/css/' + testName + '-reference.css').toString();

  sass.render({
    file: 'test/css/' + testName + '.scss',
    importer: magicImporter,
    magicImporter: {
      importOnce: true,
      cssImport: true,
      extensions: ['.scss']
    }
  }, function (error, result) {
    if (!error) {
      expect(result.css.toString()).to.equal(referenceCss);
      done();
    }
  });
}

describe('magicImporter', function () {
  describe('Test imports', function () {
    it('Combined', function (done) {
      const testName = 'combined';
      defaultTest(testName, done);
    });

    it('CSS', function (done) {
      const testName = 'css';
      defaultTest(testName, done);
    });

    it('Globbing', function (done) {
      const testName = 'globbing';
      defaultTest(testName, done);
    });

    it('Module', function (done) {
      const testName = 'module';
      defaultTest(testName, done);
    });

    it('Once', function (done) {
      const testName = 'once';
      defaultTest(testName, done);
    });

    it('Selectors', function (done) {
      const testName = 'selectors';
      defaultTest(testName, done);
    });
  });
});

