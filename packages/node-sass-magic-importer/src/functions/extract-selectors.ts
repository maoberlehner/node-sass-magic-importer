import { ICssExtractor } from '../interfaces/ICssExtractor';
import { ICssFilter } from '../interfaces/ICssFilter';
import { IPostcssSyntax } from '../interfaces/IPostcssSyntax';

export function extractSelectorsFactory(
  cssSelectorExtract: ICssExtractor,
  postcssSyntax: IPostcssSyntax,
): ICssFilter {
  return (css: string, filters: object[]) => {
    return cssSelectorExtract.processSync({
      css,
      filters,
      postcssSyntax,
    });
  };
}
