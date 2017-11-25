import { ICustomFilter } from 'css-node-extract/dist/interfaces/ICustomFilter';

export interface IFilterImporterOptions {
  customFilters?: ICustomFilter;
}

export interface IPackageImporterOptions {
  cwd?: string;
  extensions?: string[];
  packageKeys?: string[];
  packagePrefix?: string;
}

export interface IMagicImporterOptions extends IFilterImporterOptions, IPackageImporterOptions {
  disableImportOnce?: boolean;
}
