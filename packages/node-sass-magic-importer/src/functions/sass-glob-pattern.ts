import { IPath } from '../interfaces/IPath';
import { ISassGlobPattern } from '../interfaces/ISassGlobPattern';

export function sassGlobPatternFactory(path: IPath): ISassGlobPattern {
  return (base: string) => {
    const { name, ext } = path.parse(base);

    return  ext ? base : `?(_)${name}@(.css|.sass|.scss)`;
  };
}
