/* eslint-env node, mocha */
/* eslint-disable no-console */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');

const magicImporter = require('../');
const MagicImporterClass = require('../dist/MagicImporter.js');

chai.use(chaiAsPromised);

describe('magicImporter', () => {
  it('should be a function', () => expect(magicImporter).to.be.a('function'));

  it('should resolve glob import', (done) => {
    const expectedResult = fs.readFileSync('test/files/importer/glob-reference.css', {
      encoding: 'utf8'
    });
    sass.render({
      file: 'test/files/importer/glob.scss',
      importer: magicImporter
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

describe('MagicImporterClass', () => {
  it('should be a function', () => expect(MagicImporterClass).to.be.a('function'));

  /**
   * resolve()
   */
  describe('resolve()', () => {
  });
});
