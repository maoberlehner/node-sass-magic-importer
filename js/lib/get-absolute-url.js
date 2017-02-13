import globModule from 'glob';
import pathModule from 'path';

import getSassFileGlobPatternModule from './get-sass-file-glob-pattern';

export function getAbsoluteUrl({ path, getSassFileGlobPattern, glob }, url, includePaths = []) {
  const { dir, base } = path.parse(url);
  const baseGlobPattern = getSassFileGlobPattern(base);
  includePaths.some((includePath) => {
    glob.sync(path.resolve(includePath, dir, baseGlobPattern));
    return false;
  });
}

export default getAbsoluteUrl.bind(null, {
  path: pathModule,
  getSassFileGlobPattern: getSassFileGlobPatternModule,
  glob: globModule,
});
