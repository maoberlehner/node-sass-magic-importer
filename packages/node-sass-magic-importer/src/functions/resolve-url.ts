import { IGlob } from '../interfaces/IGlob';
import { IPath } from '../interfaces/IPath';
import { IResolveUrl } from '../interfaces/IResolveUrl';
import { ISassGlobPattern } from '../interfaces/ISassGlobPattern';

export function resolveUrlFactory(
  glob: IGlob,
  path: IPath,
  sassGlobPattern: ISassGlobPattern,
): IResolveUrl {
  return (url: string, includePaths: string[] = []) => {
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
  };
}
