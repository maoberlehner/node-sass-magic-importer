/* eslint-env node, mocha */
import { expect } from 'chai';

import defaultOptions from '../../js/lib/default-options';

/** @test {defaultOptions} */
describe(`defaultOptions`, () => {
  it(`should be an object`, () => expect(defaultOptions).to.be.an(`Object`));
});
