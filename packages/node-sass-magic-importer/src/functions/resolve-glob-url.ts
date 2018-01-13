import { IGlob } from '../interfaces/IGlob';
import { IPath } from '../interfaces/IPath';
import { IResolveGlobUrl } from '../interfaces/IResolveGlobUrl';

export function resolveGlobUrlFactory(
  glob: IGlob,
  path: IPath,
): IResolveGlobUrl {
  return (url: string, includePaths: string[] = []) => {
    const filePaths = new Set();

    if (glob.hasMagic(url)) {
      includePaths.forEach((includePath) => {
        const globPaths = glob.sync(url, { cwd: includePath });

        globPaths.forEach((relativePath) => {
          filePaths.add(path.resolve(includePath, relativePath)
          // This fixes a problem with importing absolute paths on windows.
          .split(`\\`).join(`/`));
        });
      });

      return [...filePaths];
    }

    return null;
  };
}
