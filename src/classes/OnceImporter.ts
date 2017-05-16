import resolveUrl from '../functions/resolve-url';

import { IImporter } from '../interfaces/IImporter';

type resolveUrl = typeof resolveUrl;

export interface IDependencies {
  resolveUrl: resolveUrl;
}

export class OnceImporter implements IImporter {
  private resolveUrl: resolveUrl;
  private store: Set<string>;

  constructor({ resolveUrl }: IDependencies) {
    this.resolveUrl = resolveUrl;
    this.store = new Set();
  }

  public import(url: string, includePaths: string[] = []) {
    const resolvedUrl = this.resolveUrl(
      url,
      includePaths,
    );

    if (this.store.has(resolvedUrl)) {
      return {
        file: ``,
        contents: ``,
      };
    }

    this.store.add(resolvedUrl);

    return { file: url };
  }
}

export function onceImporterFactory(): IImporter {
  return new OnceImporter({ resolveUrl });
}
