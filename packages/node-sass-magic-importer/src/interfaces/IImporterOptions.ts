export interface IPackageImporterOptions {
  cwd?: string;
  extensions?: string[];
  packageKeys?: string[];
  packagePrefix?: string;
}

export interface IMagicImporterOptions extends IPackageImporterOptions {
  disableImportOnce?: boolean;
}
