/* eslint-env node, mocha */
import { expect } from 'chai';

import defaultOptions from './default-options';

describe(`defaultOptions`, () => {
  it(`should be an object`, () => expect(defaultOptions).to.be.an(`Object`));
});
