import test from 'ava';

import { getAbsoluteUrl } from '../../js/lib/get-absolute-url';

test(`Should be a function.`, (t) => {
  t.is(typeof getAbsoluteUrl, `function`);
});
