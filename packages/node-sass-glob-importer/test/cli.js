/* eslint-env node, mocha */
const fs = require(`fs`);
const exec = require(`child_process`).exec;
const expect = require(`chai`).expect;

/** @test {cli} **/
describe(`cli`, () => {
  it(`should resolve glob import`, (done) => {
    const cmd = `node_modules/node-sass/bin/node-sass --importer dist/cli.js test/files/glob.scss`;
    const expectedResult = fs.readFileSync(`test/files/glob-reference.css`, {
      encoding: `utf8`
    });
    exec(cmd, (error, stdout) => {
      if (error) throw error;
      expect(stdout.trim()).to.equal(expectedResult.trim());
      done();
    });
  });
});
