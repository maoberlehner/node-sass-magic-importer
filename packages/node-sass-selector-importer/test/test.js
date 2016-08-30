/* eslint-env node, mocha */
/* eslint-disable no-console */
const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const fs = require('fs');
const sass = require('node-sass');
const path = require('path');

const selectorImporter = require('../');
const SelectorImporterClass = require('../dist/SelectorImporter.js');

// chai.use(chaiAsPromised);

describe('selectorImporter', () => {
  it('should be a function', () => expect(selectorImporter).to.be.a('function'));

  it('should resolve selector import', (done) => {
    const expectedResult = fs.readFileSync('test/files/selectors-reference.css', {
      encoding: 'utf8'
    });
    sass.render({
      file: 'test/files/selectors.scss',
      importer: selectorImporter
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

describe('SelectorImporterClass', () => {
  it('should be a function', () => expect(SelectorImporterClass).to.be.a('function'));

  /**
   * resolve()
   */
  describe('resolve()', () => {

  });
});
