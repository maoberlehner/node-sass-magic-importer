import test from 'ava';
import * as cssSelectorExtract from 'css-selector-extract';
import * as postcssSyntax from 'postcss-scss';
import * as sinon from 'sinon';

import { extractSelectorsFactory } from './extract-selectors';

test(`Should be a function.`, (t) => {
  const extractSelectors = extractSelectorsFactory(
    cssSelectorExtract,
    postcssSyntax,
  );

  t.is(typeof extractSelectors, `function`);
});

test(`Should run cssSelectorExtract with file contents.`, (t) => {
  const cssSelectorExtractStub = { processSync: sinon.stub() } as any;

  const extractSelectors = extractSelectorsFactory(
    cssSelectorExtractStub,
    postcssSyntax,
  );

  extractSelectors(`.some-css {}`, []);

  t.true(cssSelectorExtractStub.processSync.called);
});
