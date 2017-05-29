import { IPostcssSyntax } from './IPostcssSyntax';

export interface ICssExtractorOptions {
  css: string;
  postcssSyntax?: IPostcssSyntax;
}

export interface ICssExtractor {
  processSync: (options: ICssExtractorOptions) => string;
}

// @see https://github.com/maoberlehner/css-selector-extract/issues/41
export interface ICssExtractorLegacy {
  processSync: (css: string, filter: object[], postcssSyntax?: IPostcssSyntax) => string;
}
