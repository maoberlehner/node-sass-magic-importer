/* eslint-env node, mocha */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { exec } from 'child_process';
import fs from 'fs';
import sass from 'node-sass';

import filterImporter from '../js/index';

const expect = chai.expect;
chai.use(chaiAsPromised);

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

/** @test {cli} **/
describe(`cli`, () => {
  it(`should resolve combined filter import`, (done) => {
    const cmd = `node_modules/node-sass/bin/node-sass --importer dist/cli.js test/files/combined.scss`;
    const expectedResult = fs.readFileSync(`test/files/combined-reference.css`, {
      encoding: `utf8`,
    });
    exec(cmd, (error, stdout) => {
      if (error) throw error;
      expect(stdout.trim()).to.equal(expectedResult.trim());
      done();
    });
  });
});
