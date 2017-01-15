/* eslint-env node, mocha */
const exec = require(`child_process`).exec;
const expect = require(`chai`).expect;
const fs = require(`fs`);

/** @test {cli} **/
describe(`cli`, () => {
  it(`should convert a SASS file to CSS`, (done) => {
    // eslint-disable-next-line max-len
    const cmd = `node_modules/node-sass/bin/node-sass --importer dist/cli.js test/files/module.scss`;
    const expectedResult = fs.readFileSync(`test/files/module-reference.css`, {
      encoding: `utf8`
    });
    exec(cmd, (error, stdout) => {
      if (error) throw error;
      expect(stdout.trim()).to.equal(expectedResult.trim());
      done();
    });
  });
});
