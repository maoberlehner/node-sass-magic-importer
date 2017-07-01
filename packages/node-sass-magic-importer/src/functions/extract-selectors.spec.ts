import test from 'ava';
import * as cssSelectorExtract from 'css-selector-extract';
import * as fs from 'fs';
import * as postcssSyntax from 'postcss-scss';
import * as sinon from 'sinon';

import { extractSelectorsFactory } from './extract-selectors';

test(`Should be a function.`, (t) => {
  const extractSelectors = extractSelectorsFactory(
    cssSelectorExtract,
    fs,
    postcssSyntax,
  );

  t.is(typeof extractSelectors, `function`);
});

test(`Should run cssSelectorExtract with file contents.`, (t) => {
  const cssSelectorExtractStub = { processSync: sinon.stub() } as any;
  const fsStub = { readFileSync: sinon.stub().returns(`.css {}`) } as any;

  const extractSelectors = extractSelectorsFactory(
    cssSelectorExtractStub,
    fsStub,
    postcssSyntax,
  );

  extractSelectors(`some-url`, []);

  t.true(fsStub.readFileSync.calledWith(`some-url`));
  t.true(cssSelectorExtractStub.processSync.called);
});
