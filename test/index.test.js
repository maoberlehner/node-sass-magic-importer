import 'babel-polyfill';
import fs from 'fs';
import sass from 'node-sass';
import test from 'ava';

import magicImporter from '../js/index';

test(`Should be a function.`, (t) => {
  t.is(typeof magicImporter, `function`);
});

test(`Should convert a SASS file synchronously to CSS.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/combined-reference.css`, {
    encoding: `utf8`,
  });
  const result = sass.renderSync({
    file: `test/files/combined.scss`,
    importer: magicImporter(),
  });

  t.is(result.css.toString(), expectedResult);
});

test.serial(`Should convert a SASS file asynchronously to CSS.`, async (t) => {
  const expectedResult = fs.readFileSync(`test/files/combined-reference.css`, {
    encoding: `utf8`,
  });
  const renderPromise = new Promise((resolve) => {
    sass.render({
      file: `test/files/combined.scss`,
      importer: magicImporter(),
    }, (error, result) => {
      if (error) throw error;
      resolve(result.css.toString());
    });
  });

  t.is(await renderPromise, expectedResult);
});

test(`Should filter and convert a SASS file synchronously to CSS.`, (t) => {
  const expectedResult = fs.readFileSync(`test/files/filter-reference.css`, {
    encoding: `utf8`,
  });
  const result = sass.renderSync({
    file: `test/files/filter.scss`,
    importer: magicImporter(),
  });

  t.is(result.css.toString(), expectedResult);
});

test(`Should compile bootstrap.`, async (t) => {
  const renderPromise = new Promise((resolve) => {
    sass.render({
      file: `test/files/bootstrap.scss`,
      importer: magicImporter(),
    }, (error) => {
      if (error) throw error;
      resolve(true);
    });
  });

  t.true(await renderPromise);
});

test(`Should compile bootstrap imported with alternative prefix.`, async (t) => {
  const renderPromise = new Promise((resolve) => {
    sass.render({
      file: `test/files/bootstrap-alt-prefix.scss`,
      importer: magicImporter({ prefix: `+` }),
    }, (error) => {
      if (error) throw error;
      resolve(true);
    });
  });

  t.true(await renderPromise);
});

test(`Should compile foundation.`, async (t) => {
  const renderPromise = new Promise((resolve) => {
    sass.render({
      file: `test/files/foundation.scss`,
      importer: magicImporter(),
    }, (error) => {
      if (error) throw error;
      resolve(true);
    });
  });

  t.true(await renderPromise);
});
