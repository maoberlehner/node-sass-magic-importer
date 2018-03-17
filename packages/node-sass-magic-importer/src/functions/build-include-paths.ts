import { IBuildIncludePaths } from '../interfaces/IBuildIncludePaths';
import { IPath } from '../interfaces/IPath';

export function buildIncludePathsFactory(
  path: IPath,
): IBuildIncludePaths {
  return (nodeSassIncludePaths: string, previouslyResolvedPath: string) => {
    const includePaths = [];

    if (path.isAbsolute(previouslyResolvedPath)) {
      includePaths.push(path.dirname(previouslyResolvedPath));
    }

    return [...new Set([...includePaths, ...nodeSassIncludePaths.split(path.delimiter)])] as string[];
  };
}
