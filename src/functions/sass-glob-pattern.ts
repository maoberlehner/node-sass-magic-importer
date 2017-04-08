import * as path from 'path';

export interface IDependencies {
  path: typeof path;
}

export function sassGlobPattern(
  { path }: IDependencies,
  base: string,
) {
  const { name, ext } = path.parse(base);

  return  ext ? base : `?(_)${name}@(.css|.sass|.scss)`;
}

export function sassGlobPatternFactory(dependencies: IDependencies): (
  base: string,
) => string {
  return sassGlobPattern.bind(null, dependencies);
}

export default sassGlobPatternFactory({ path });
