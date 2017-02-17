import globModule from 'glob';
import pathModule from 'path';

import sassFileGlobPatternModule from './sass-file-glob-pattern';

export function resolveUrl({ path, sassFileGlobPattern, glob }, url, includePaths = []) {
  const { dir, base } = path.parse(url);
  const baseGlobPattern = sassFileGlobPattern(base);
  let resolvedUrls = [];

  includePaths.some((includePath) => {
    resolvedUrls = glob.sync(
      path.resolve(includePath, dir, baseGlobPattern)
    );
    return resolvedUrls[0] || false;
  });

  return resolvedUrls[0] || url;
}

export default resolveUrl.bind(null, {
  path: pathModule,
  sassFileGlobPattern: sassFileGlobPatternModule,
  glob: globModule,
});
