import { IPath } from '../interfaces/IPath';
import { ISassUrlVariants } from '../interfaces/ISassUrlVariants';

export function sassUrlVariantsFactory(path: IPath): ISassUrlVariants {
  return (url: string, extensions: string[] = []) => {
    const parsedUrl = path.parse(url);
    const urlVariants = [url];

    if (parsedUrl.dir && !parsedUrl.ext) {
      extensions.forEach((extension) => {
        urlVariants.push(path.join(parsedUrl.dir, `${parsedUrl.name}${extension}`));
        urlVariants.push(path.join(parsedUrl.dir, `_${parsedUrl.name}${extension}`));
      });
    }

    return urlVariants;
  };
}
