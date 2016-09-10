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

/** @test {index} */
describe('magicImporter', () => {
  it('should be a function', () => expect(magicImporter).to.be.a('function'));

  it('should convert a SASS file successfully to CSS', (done) => {
    const expectedResult = fs.readFileSync('test/files/combined-reference.css', {
      encoding: 'utf8'
    });
    sass.render({
      file: 'test/files/combined.scss',
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

/** @test {MagicImporter} */
describe('SelectorImporterClass', () => {
  it('should be a function', () => expect(MagicImporterClass).to.be.a('function'));

  /** @test {MagicImporter#resolveSync} */
  describe('resolveSync()', () => {
    it('should be a function', () => {
      const magicImporterInstance = new MagicImporterClass();
      expect(magicImporterInstance.resolveSync).to.be.a('function');
    });
  });

  /** @test {MagicImporter#resolve} */
  describe('resolve()', () => {
    it('should be a function', () => {
      const magicImporterInstance = new MagicImporterClass();
      expect(magicImporterInstance.resolve).to.be.a('function');
    });
  });
});

