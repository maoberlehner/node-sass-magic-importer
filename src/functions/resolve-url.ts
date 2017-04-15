import * as glob from 'glob';
import * as path from 'path';

import sassGlobPattern from './sass-glob-pattern';

export interface IDependencies {
  glob: typeof glob;
  path: typeof path;
  sassGlobPattern: typeof sassGlobPattern;
}

export function resolveUrl(
  { glob, path, sassGlobPattern }: IDependencies,
  url: string,
  includePaths: string[] = [],
) {
  const { dir, base } = path.parse(url);
  const baseGlobPattern = sassGlobPattern(base);
  let resolvedUrls: string[] = [];

  includePaths.some((includePath) => {
    resolvedUrls = glob.sync(
      path.resolve(includePath, dir, baseGlobPattern),
    );
    return resolvedUrls.length > 0 || false;
  });

  return resolvedUrls[0] || url;
}

export function resolveUrlFactory(dependencies: IDependencies): (
  url: string,
  includePaths: string[],
) => string {
  return resolveUrl.bind(null, dependencies);
}

export default resolveUrlFactory({ glob, path, sassGlobPattern });
