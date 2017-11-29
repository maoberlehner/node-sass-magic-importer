import { IResolve } from '../interfaces/IResolve';
import { IResolvePackageKey } from '../interfaces/IResolvePackageKey';
import { IResolvePackageUrl } from '../interfaces/IResolvePackageUrl';
import { ISassUrlVariants } from '../interfaces/ISassUrlVariants';

export function resolvePackageUrlFactory(
  resolve: IResolve,
  resolvePackageKey: IResolvePackageKey,
  sassUrlVariants: ISassUrlVariants,
): IResolvePackageUrl {
  return (url: string, extensions: string[], cwd: string, packageKeys: any) => {
    let file: string|null = null;

    sassUrlVariants(url, extensions).some((urlVariant) => {
      try {
        /* istanbul ignore next: resolve.sync is mocked anyway */
        const resolvedPath = resolve.sync(urlVariant, {
          basedir: cwd,
          packageFilter: (packageJson) => resolvePackageKey(packageJson, packageKeys),
          extensions,
        });
        if (resolvedPath) {
          file = resolvedPath;
          return true;
        }
      } catch (e) {
        // Prevent the resolve module from throwing an
        // exception if no matching package is found.
      }
      return false;
    });

    return file;
  };
}
