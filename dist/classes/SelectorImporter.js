// import resolveUrl from '../functions/resolve-url';
// import { IImporter, IImporterOptions } from '../interfaces/IImporter';
// type ResolveUrl = typeof resolveUrl;
// export interface IDependencies {
//   resolveUrl: ResolveUrl;
// }
// export class SelectorImporter implements IImporter {
//   private resolveUrl: ResolveUrl;
//   private store: Set<string>;
//   constructor(
//     { resolveUrl }: IDependencies,
//     options: IImporterOptions,
//   ) {
//     this.resolveUrl = resolveUrl;
//     this.store = new Set();
//   }
//   public import(url: string, includePaths: string[] = []) {
//     const resolvedUrl = this.resolveUrl(
//       url,
//       includePaths,
//     );
//     if (this.store.has(resolvedUrl)) {
//       return {
//         file: ``,
//         contents: ``,
//       };
//     }
//     this.store.add(resolvedUrl);
//     return { file: url };
//   }
// }
// export function onceImporterFactory(
//   options: IImporterOptions,
// ): IImporter {
//   return new OnceImporter({ resolveUrl }, options);
// }
//# sourceMappingURL=SelectorImporter.js.map