import test from 'ava';
import * as cssNodeExtract from 'css-node-extract';
import * as fs from 'fs';
import * as postcssSyntax from 'postcss-scss';
import * as sinon from 'sinon';

import { extractNodesFactory } from './extract-nodes';

test(`Should be a function.`, (t) => {
  const extractNodes = extractNodesFactory(
    cssNodeExtract,
    fs,
    postcssSyntax,
  );

  t.is(typeof extractNodes, `function`);
});

test(`Should run cssNodeExtract with file contents.`, (t) => {
  const cssNodeExtractStub = { processSync: sinon.stub() } as any;
  const fsStub = { readFileSync: sinon.stub().returns(`.css {}`) } as any;

  const extractNodes = extractNodesFactory(
    cssNodeExtractStub,
    fsStub,
    postcssSyntax,
  );

  extractNodes(`some-url`, []);

  t.true(fsStub.readFileSync.calledWith(`some-url`));
  t.true(cssNodeExtractStub.processSync.called);
});
