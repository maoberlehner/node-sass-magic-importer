/* eslint-env node, mocha */
import fs from 'fs';
import { exec } from 'child_process';
import { expect } from 'chai';

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
