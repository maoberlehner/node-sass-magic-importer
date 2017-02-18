import globModule from 'glob';
import pathModule from 'path';

import sassGlobPatternModule from './sass-glob-pattern';

function resolveUrl({ path, sassGlobPattern, glob }, url, includePaths = []) {
  const { dir, base } = path.parse(url);
  const baseGlobPattern = sassGlobPattern(base);
  let resolvedUrls = [];

  includePaths.some((includePath) => {
    resolvedUrls = glob.sync(
      path.resolve(includePath, dir, baseGlobPattern)
    );
    return resolvedUrls[0] || false;
  });

  return resolvedUrls[0] || url;
}

export function resolveUrlFactory(dependencies) {
  return resolveUrl.bind(null, dependencies);
}

export default resolveUrl.bind(null, {
  path: pathModule,
  sassGlobPattern: sassGlobPatternModule,
  glob: globModule,
});
