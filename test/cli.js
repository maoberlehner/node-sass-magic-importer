/* eslint-env node, mocha */
const fs = require(`fs`);
const exec = require(`child_process`).exec;
const expect = require(`chai`).expect;

/** @test {cli} **/
describe(`cli`, () => {
  it(`should convert a SASS file to CSS`, (done) => {
    // eslint-disable-next-line max-len
    const cmd = `node_modules/node-sass/bin/node-sass --importer dist/cli.js test/files/combined.scss`;
    const expectedResult = fs.readFileSync(`test/files/combined-reference.css`, {
      encoding: `utf8`
    });
    exec(cmd, (error, stdout) => {
      if (error) throw error;
      expect(stdout.trim()).to.equal(expectedResult.trim());
      done();
    });
  });
});
