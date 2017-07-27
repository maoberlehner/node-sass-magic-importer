import { IBuildIncludePaths } from '../interfaces/IBuildIncludePaths';
import { IPath } from '../interfaces/IPath';

export function buildIncludePathsFactory(
  path: IPath,
): IBuildIncludePaths {
  return (nodeSassIncludePaths: string, previouslyResolvedPath: string) => {
    const includePathsSet = new Set(nodeSassIncludePaths.split(path.delimiter));

    if (path.isAbsolute(previouslyResolvedPath)) {
      includePathsSet.add(path.dirname(previouslyResolvedPath));
    }

    return [...includePathsSet] as string[];
  };
}
