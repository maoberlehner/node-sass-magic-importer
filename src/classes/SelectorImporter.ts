 // TODO: Refactor.

import * as cssSelectorExtract from 'css-selector-extract';
import * as fs from 'fs';
import * as postcssScss from 'postcss-scss';

import cleanImportUrl from '../functions/clean-import-url';
import parseSelectorFilters from '../functions/parse-selector-filters';
import resolveUrl from '../functions/resolve-url';

import { IImporter } from '../interfaces/IImporter';
import { ISelectorFilter } from '../interfaces/ISelectorFilter';

type CleanImportUrl = typeof cleanImportUrl;
type CssSelectorExtract = typeof cssSelectorExtract;
type Fs = typeof fs;
type ParseSelectorFilters = typeof parseSelectorFilters;
type PostcssScss = typeof postcssScss;
type ResolveUrl = typeof resolveUrl;

export interface IDependencies {
  cleanImportUrl: CleanImportUrl;
  cssSelectorExtract: CssSelectorExtract;
  fs: Fs;
  parseSelectorFilters: ParseSelectorFilters;
  postcssScss: PostcssScss;
  resolveUrl: ResolveUrl;
}

export class SelectorImporter implements IImporter {
  private cleanImportUrl: CleanImportUrl;
  private cssSelectorExtract: CssSelectorExtract;
  private fs: Fs;
  private parseSelectorFilters: ParseSelectorFilters;
  private postcssScss: PostcssScss;
  private resolveUrl: ResolveUrl;

  constructor({
    cleanImportUrl,
    cssSelectorExtract,
    fs,
    parseSelectorFilters,
    postcssScss,
    resolveUrl,
  }: IDependencies) {
    this.cleanImportUrl = cleanImportUrl;
    this.cssSelectorExtract = cssSelectorExtract;
    this.fs = fs;
    this.parseSelectorFilters = parseSelectorFilters;
    this.postcssScss = postcssScss;
    this.resolveUrl = resolveUrl;
  }

  public import(url: string, includePaths: string[] = []) {
    const selectorFilters = this.parseSelectorFilters(url);

    if (selectorFilters.length === 0) {
      return null;
    }

    const cleanedUrl = this.cleanImportUrl(url);
    const resolvedUrl = this.resolveUrl(cleanedUrl, includePaths);
    const contents = this.extractSelectors(resolvedUrl, selectorFilters);

    return contents ? { contents } : null;
  }

  private extractSelectors(resolvedUrl: string, selectorFilters: ISelectorFilter[]) {
    const css = this.fs.readFileSync(resolvedUrl, { encoding: `utf8` });

    return this.cssSelectorExtract.processSync(css, selectorFilters, this.postcssScss);
  }
}

export function selectorImporterFactory(): IImporter {
  return new SelectorImporter({
    cleanImportUrl,
    cssSelectorExtract,
    fs,
    parseSelectorFilters,
    postcssScss,
    resolveUrl,
  });
}
