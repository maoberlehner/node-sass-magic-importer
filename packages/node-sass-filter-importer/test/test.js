/* eslint-env node, mocha */
/* eslint-disable no-console */
const chai = require(`chai`);
const chaiAsPromised = require(`chai-as-promised`);
const exec = require(`child_process`).exec;
const expect = require(`chai`).expect;
const fs = require(`fs`);
const sass = require(`node-sass`);

const filterImporter = require(`../`);
const FilterImporterClass = require(`../dist/lib/FilterImporter.js`);

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
      if (!error) {
        expect(result.css.toString()).to.equal(expectedResult);
        done();
      } else {
        console.log(error);
      }
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
  it(`should resolve combined filter import synchronously`, (done) => {
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

/** @test {FilterImporter} */
describe(`FilterImporterClass`, () => {
  it(`should be a function`, () => expect(FilterImporterClass).to.be.a(`function`));

  /** @test {FilterImporter#parseUrl} */
  describe(`parseUrl()`, () => {
    it(`should be a function`, () => {
      const filterImporterInstance = new FilterImporterClass();
      expect(filterImporterInstance.parseUrl).to.be.a(`function`);
    });

    it(`should return object with url and empty filters`, () => {
      const filterImporterInstance = new FilterImporterClass();
      const url = `path/without/filters.scss`;
      const expectedResult = {
        url,
        filterNames: undefined,
      };
      return expect(filterImporterInstance.parseUrl(url)).to.deep.equal(expectedResult);
    });

    it(`should return object with url and filters`, () => {
      const filterImporterInstance = new FilterImporterClass();
      const url = `[variables, mixins] from path/with/filters.scss`;
      const expectedResult = {
        url: `path/with/filters.scss`,
        filterNames: [
          `variables`,
          `mixins`,
        ],
      };
      return expect(filterImporterInstance.parseUrl(url))
        .to.deep.equal(expectedResult);
    });
  });

  /** @test {FilterImporter#extractFilters} */
  describe(`extractFilters()`, () => {
    it(`should be a function`, () => {
      const filterImporterInstance = new FilterImporterClass();
      expect(filterImporterInstance.extractFilters).to.be.a(`function`);
    });

    it(`should return null`, () => {
      const filterImporterInstance = new FilterImporterClass();
      const cleanUrl = `some/url.scss`;
      const filterNames = null;
      const expectedResult = null;
      return expect(filterImporterInstance.extractFilters(cleanUrl, filterNames))
        .to.equal(expectedResult);
    });

    it(`should return filtered contents`, () => {
      const filterImporterInstance = new FilterImporterClass();
      const cleanUrl = `test/files/test.scss`;
      const filterNames = [
        `variables`,
        `mixins`,
      ];
      const expectedResult = fs.readFileSync(`test/files/combined-reference.scss`, {
        encoding: `utf8`,
      });
      return expect(filterImporterInstance.extractFilters(cleanUrl, filterNames))
        .to.equal(expectedResult);
    });
  });

  /** @test {FilterImporter#resolveSync} */
  describe(`resolveSync()`, () => {
    it(`should be a function`, () => {
      const filterImporterInstance = new FilterImporterClass();
      expect(filterImporterInstance.resolveSync).to.be.a(`function`);
    });
  });

  /** @test {FilterImporter#resolve} */
  describe(`resolve()`, () => {
    it(`should be a function`, () => {
      const filterImporterInstance = new FilterImporterClass();
      expect(filterImporterInstance.resolve).to.be.a(`function`);
    });

    it(`should return null`, () => {
      const filterImporterInstance = new FilterImporterClass();
      const url = `path/without/filters.scss`;
      const expectedResult = null;
      return expect(filterImporterInstance.resolve(url)).to.eventually.equal(expectedResult);
    });

    it(`should return filtered contents`, () => {
      const filterImporterInstance = new FilterImporterClass();
      const url = `[variables, mixins] from test/files/test.scss`;
      const contents = fs.readFileSync(`test/files/combined-reference.scss`, {
        encoding: `utf8`,
      });
      const expectedResult = { contents };
      return expect(filterImporterInstance.resolve(url)).to.eventually.deep.equal(expectedResult);
    });
  });
});
