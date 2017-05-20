import * as cssNodeExtract from 'css-node-extract';
import * as fs from 'fs';
import * as postcssScss from 'postcss-scss';

import cleanImportUrl from '../functions/clean-import-url';
import parseNodeFilters from '../functions/parse-node-filters';
import resolveUrl from '../functions/resolve-url';

import { IImporter } from '../interfaces/IImporter';

type CleanImportUrl = typeof cleanImportUrl;
type CssNodeExtract = typeof cssNodeExtract;
type Fs = typeof fs;
type ParseNodeFilters = typeof parseNodeFilters;
type PostcssScss = typeof postcssScss;
type ResolveUrl = typeof resolveUrl;

export interface IDependencies {
  cleanImportUrl: CleanImportUrl;
  cssNodeExtract: CssNodeExtract;
  fs: Fs;
  parseNodeFilters: ParseNodeFilters;
  postcssScss: PostcssScss;
  resolveUrl: ResolveUrl;
}

export class NodeImporter implements IImporter {
  private cleanImportUrl: CleanImportUrl;
  private cssNodeExtract: CssNodeExtract;
  private fs: Fs;
  private parseNodeFilters: ParseNodeFilters;
  private postcssScss: PostcssScss;
  private resolveUrl: ResolveUrl;

  constructor({
    cleanImportUrl,
    cssNodeExtract,
    fs,
    parseNodeFilters,
    postcssScss,
    resolveUrl,
  }: IDependencies) {
    this.cleanImportUrl = cleanImportUrl;
    this.cssNodeExtract = cssNodeExtract;
    this.fs = fs;
    this.parseNodeFilters = parseNodeFilters;
    this.postcssScss = postcssScss;
    this.resolveUrl = resolveUrl;
  }

  public import(url: string, includePaths: string[] = []) {
    const nodeFilters = this.parseNodeFilters(url);

    if (nodeFilters.length === 0) {
      return null;
    }

    const cleanedUrl = this.cleanImportUrl(url);
    const resolvedUrl = this.resolveUrl(cleanedUrl, includePaths);
    const contents = this.extractNodes(resolvedUrl, nodeFilters);

    return contents ? { contents } : null;
  }

  private extractNodes(resolvedUrl: string, nodeFilters: string[]) {
    const css = this.fs.readFileSync(resolvedUrl, { encoding: `utf8` });

    return this.cssNodeExtract.processSync({
      css,
      filterNames: nodeFilters,
      postcssSyntax: this.postcssScss,
    });
  }
}

export function nodeImporterFactory(): IImporter {
  return new NodeImporter({
    cleanImportUrl,
    cssNodeExtract,
    fs,
    parseNodeFilters,
    postcssScss,
    resolveUrl,
  });
}
