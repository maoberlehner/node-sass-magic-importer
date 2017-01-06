/* eslint-env node, mocha */
import fs from 'fs';
import sass from 'node-sass';
import { expect } from 'chai';

import filterImporter from '../js/index';

/** @test {index} */
describe(`filterImporter`, () => {
  it(`should be a function`, () => expect(filterImporter).to.be.a(`function`));

  it(`should resolve combined filter import asynchronously`, (done) => {
    const expectedResult = fs.readFileSync(`test/files/combined-reference.css`, {
      encoding: `utf8`,
    });
    sass.render({
      file: `test/files/combined.scss`,
      importer: filterImporter(),
    }, (error, result) => {
      if (error) throw error;
      expect(result.css.toString()).to.equal(expectedResult);
      done();
    });
  });

  it(`should resolve combined filter import synchronously`, () => {
    const expectedResult = fs.readFileSync(`test/files/combined-reference.css`, {
      encoding: `utf8`,
    });
    const result = sass.renderSync({
      file: `test/files/combined.scss`,
      importer: filterImporter(),
    });
    expect(result.css.toString()).to.equal(expectedResult);
  });
});
