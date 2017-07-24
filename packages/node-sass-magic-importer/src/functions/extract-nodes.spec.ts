import test from 'ava';
import * as cssNodeExtract from 'css-node-extract';
import * as postcssSyntax from 'postcss-scss';
import * as sinon from 'sinon';

import { extractNodesFactory } from './extract-nodes';

test(`Should be a function.`, (t) => {
  const extractNodes = extractNodesFactory(
    cssNodeExtract,
    postcssSyntax,
  );

  t.is(typeof extractNodes, `function`);
});

test(`Should run cssNodeExtract with file contents.`, (t) => {
  const cssNodeExtractStub = { processSync: sinon.stub() } as any;

  const extractNodes = extractNodesFactory(
    cssNodeExtractStub,
    postcssSyntax,
  );

  extractNodes(`.some-css {}`, []);

  t.true(cssNodeExtractStub.processSync.called);
});
