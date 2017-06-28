import { ICssExtractor, ICssExtractorOptions } from '../interfaces/ICssExtractor';
import { ICssFilter } from '../interfaces/ICssFilter';
import { IFs } from '../interfaces/IFs';
import { IPostcssSyntax } from '../interfaces/IPostcssSyntax';

export function extractNodesFactory(
  cssNodeExtract: ICssExtractor,
  fs: IFs,
  postcssSyntax: IPostcssSyntax,
): ICssFilter {
  return (resolvedUrl: string, filters: string[]) => {
    const css = fs.readFileSync(resolvedUrl, { encoding: `utf8` });

    return cssNodeExtract.processSync({
      css,
      filters,
      postcssSyntax,
    });
  };
}
