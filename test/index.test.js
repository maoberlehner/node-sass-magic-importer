/* eslint-env node, mocha */
import fs from 'fs';
import sass from 'node-sass';
import { expect } from 'chai';

import magicImporter from '../js/index';

/** @test {index} */
describe(`magicImporter`, () => {
  it(`should be a function`, () => expect(magicImporter).to.be.a(`function`));

  it(`should convert a SASS file synchronously to CSS`, () => {
    const expectedResult = fs.readFileSync(`test/files/combined-reference.css`, {
      encoding: `utf8`,
    });
    const result = sass.renderSync({
      file: `test/files/combined.scss`,
      importer: magicImporter(),
    });
    expect(result.css.toString()).to.equal(expectedResult);
  });

  it(`should convert a SASS file asynchronously to CSS`, (done) => {
    const expectedResult = fs.readFileSync(`test/files/combined-reference.css`, {
      encoding: `utf8`,
    });
    sass.render({
      file: `test/files/combined.scss`,
      importer: magicImporter(),
    }, (error, result) => {
      if (error) throw error;
      expect(result.css.toString()).to.equal(expectedResult);
      done();
    });
  });

  it(`should filter and convert a SASS file synchronously to CSS`, () => {
    const expectedResult = fs.readFileSync(`test/files/filter-reference.css`, {
      encoding: `utf8`,
    });
    const result = sass.renderSync({
      file: `test/files/filter.scss`,
      importer: magicImporter(),
    });
    expect(result.css.toString()).to.equal(expectedResult);
  });

  it(`should compile bootstrap`, (done) => {
    sass.render({
      file: `test/files/bootstrap.scss`,
      importer: magicImporter(),
    }, (error) => {
      if (error) throw error;
      done();
    });
  });

  it(`should compile bootstrap imported with alternative prefix`, (done) => {
    sass.render({
      file: `test/files/bootstrap-alt-prefix.scss`,
      importer: magicImporter({ prefix: `+` }),
    }, (error) => {
      if (error) throw error;
      done();
    });
  });

  it(`should compile foundation`, (done) => {
    sass.render({
      file: `test/files/foundation.scss`,
      importer: magicImporter(),
    }, (error) => {
      if (error) throw error;
      done();
    });
  });
});
