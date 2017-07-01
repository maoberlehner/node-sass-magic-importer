import { ICssExtractor } from '../interfaces/ICssExtractor';
import { ICssFilter } from '../interfaces/ICssFilter';
import { IFs } from '../interfaces/IFs';
import { IPostcssSyntax } from '../interfaces/IPostcssSyntax';

export function extractSelectorsFactory(
  cssSelectorExtract: ICssExtractor,
  fs: IFs,
  postcssSyntax: IPostcssSyntax,
): ICssFilter {
  return (resolvedUrl: string, filters: object[]) => {
    const css = fs.readFileSync(resolvedUrl, { encoding: `utf8` });

    return cssSelectorExtract.processSync({
      css,
      filters,
      postcssSyntax,
    });
  };
}
