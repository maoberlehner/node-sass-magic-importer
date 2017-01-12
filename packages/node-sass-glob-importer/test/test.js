/* eslint-env node, mocha */
/* eslint-disable no-console */
const chai = require(`chai`);
const chaiAsPromised = require(`chai-as-promised`);
const expect = require(`chai`).expect;
const fs = require(`fs`);
const sass = require(`node-sass`);
const path = require(`path`);

const globImporter = require(`../`);
const GlobImporterClass = require(`../dist/GlobImporter.js`);

chai.use(chaiAsPromised);

/** @test {index} */
describe(`globImporter`, () => {
  it(`should be a function`, () => expect(globImporter).to.be.a(`function`));

  it(`should resolve glob import asynchronously`, (done) => {
    const expectedResult = fs.readFileSync(`test/files/glob-reference.css`, {
      encoding: `utf8`
    });
    sass.render({
      file: `test/files/glob.scss`,
      importer: globImporter()
    }, (error, result) => {
      if (error) throw error;

      expect(result.css.toString()).to.equal(expectedResult);
      done();
    });
  });

  it(`should resolve glob import synchronously`, () => {
    const expectedResult = fs.readFileSync(`test/files/glob-reference.css`, {
      encoding: `utf8`
    });
    const result = sass.renderSync({
      file: `test/files/glob.scss`,
      importer: globImporter()
    });
    expect(result.css.toString()).to.equal(expectedResult);
  });

  it(`should resolve glob import with include path`, () => {
    const expectedResult = fs.readFileSync(`test/files/include-path-reference.css`, {
      encoding: `utf8`
    });
    const result = sass.renderSync({
      file: `test/files/include-path.scss`,
      importer: globImporter({
        includePaths: [path.join(process.cwd(), `test/files/test-imports`)]
      })
    });
    expect(result.css.toString()).to.equal(expectedResult);
  });
});

/** @test {GlobImporter} */
describe(`GlobImporter`, () => {
  it(`should be a function`, () => expect(GlobImporterClass).to.be.a(`function`));

  /** @test {GlobImporter#resolveSync} */
  describe(`resolveSync()`, () => {
    it(`should be a function`, () => {
      const globImporterInstance = new GlobImporterClass();
      expect(globImporterInstance.resolveSync).to.be.a(`function`);
    });
  });

  /** @test {GlobImporter#resolveFilePathsSync} */
  describe(`resolveFilePathsSync()`, () => {
    it(`should be a function`, () => {
      const globImporterInstance = new GlobImporterClass();
      expect(globImporterInstance.resolveFilePathsSync).to.be.a(`function`);
    });
  });

  /** @test {GlobImporter#resolveFilePaths} */
  describe(`resolveFilePaths()`, () => {
    it(`should be a function`, (done) => {
      const globImporterInstance = new GlobImporterClass();
      expect(globImporterInstance.resolveFilePaths).to.be.a(`function`);
      done();
    });

    it(`should return an empty array`, (done) => {
      const globImporterInstance = new GlobImporterClass();
      const url = `path/without/glob/pattern.scss`;
      const expectedResult = [];
      expect(globImporterInstance.resolveFilePaths(url))
        .to.eventually.deep.equal(expectedResult);
      done();
    });

    it(`should return array of resolved urls`, (done) => {
      const globImporterInstance = new GlobImporterClass();
      const url = `files/test-resolve/**/*.scss`;
      const includePath = path.join(process.cwd(), `test`);
      const expectedResult = [
        path.join(includePath, `files/test-resolve/style1.scss`),
        path.join(includePath, `files/test-resolve/style2.scss`)
      ];

      globImporterInstance.options.includePaths = [includePath];

      expect(globImporterInstance.resolveFilePaths(url))
        .to.eventually.deep.equal(expectedResult);
      done();
    });
  });

  /** @test {GlobImporter#resolve} */
  describe(`resolve()`, () => {
    it(`should be a function`, () => {
      const globImporterInstance = new GlobImporterClass();
      expect(globImporterInstance.resolve).to.be.a(`function`);
    });

    it(`should return null`, (done) => {
      const globImporterInstance = new GlobImporterClass();
      const url = `path/without/glob/pattern.scss`;
      const expectedResult = null;

      expect(globImporterInstance.resolve(url))
        .to.eventually.equal(expectedResult);
      done();
    });

    it(`should return contents of resolved urls`, (done) => {
      const globImporterInstance = new GlobImporterClass();
      const url = `files/test-resolve/**/*.scss`;
      const expectedResult = {
        contents: `.class-a { content: 'Class A'; }\n\n.class-b { content: 'Class B'; }\n`
      };

      globImporterInstance.options.includePaths = [path.join(process.cwd(), `test`)];

      expect(globImporterInstance.resolve(url))
        .to.eventually.deep.equal(expectedResult);
      done();
    });

    it(`should return null`, (done) => {
      const globImporterInstance = new GlobImporterClass();
      const url = `files/test-resolve/test-empty/**/*.scss`;
      const expectedResult = null;

      globImporterInstance.options.includePaths = [path.join(process.cwd(), `test`)];

      expect(globImporterInstance.resolve(url))
        .to.eventually.deep.equal(expectedResult);
      done();
    });
  });
});
