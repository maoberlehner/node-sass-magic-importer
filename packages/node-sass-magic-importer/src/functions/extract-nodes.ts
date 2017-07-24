import { ICssExtractor, ICssExtractorOptions } from '../interfaces/ICssExtractor';
import { ICssFilter } from '../interfaces/ICssFilter';
import { IPostcssSyntax } from '../interfaces/IPostcssSyntax';

export function extractNodesFactory(
  cssNodeExtract: ICssExtractor,
  postcssSyntax: IPostcssSyntax,
): ICssFilter {
  return (css: string, filters: string[]) => {
    return cssNodeExtract.processSync({
      css,
      filters,
      postcssSyntax,
    });
  };
}
