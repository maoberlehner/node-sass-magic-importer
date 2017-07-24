import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import magicImporter from '../packages/node-sass-magic-importer/dist/index';

test(`Should import only specific nodes.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/filter-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/filter-import.scss`,
    importer: magicImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import glob files.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/glob-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/glob-import.scss`,
    importer: magicImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import glob files with filters and in packages.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/glob-combined-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/glob-combined-import.scss`,
    importer: magicImporter({
      cwd: `${__dirname}/files`
    }),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import files only once.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/once-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/once-import.scss`,
    importer: magicImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import the modules main file.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/package-import.css`, {
    encoding: `utf8`,
  });
  const result = sass.renderSync({
    file: `test/files/package-import.scss`,
    importer: magicImporter({
      cwd: `${__dirname}/files`
    }),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import the module files with filters.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/package-combined-import.css`, {
    encoding: `utf8`,
  });
  const result = sass.renderSync({
    file: `test/files/package-combined-import.scss`,
    importer: magicImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});

test(`Should import only specific selectors and replace them.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/selector-import.css`, {
    encoding: `utf8`,
  });

  const result = sass.renderSync({
    file: `test/files/selector-import.scss`,
    importer: magicImporter(),
  }).css.toString();

  t.is(result, expectedResult);
});
