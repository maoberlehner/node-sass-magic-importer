import { IPostcssSyntax } from './IPostcssSyntax';

export interface ICssExtractorOptions {
  css: string;
  filters: string[]|object[];
  postcssSyntax?: IPostcssSyntax;
}

export interface ICssExtractor {
  processSync: (options: ICssExtractorOptions) => string;
}
