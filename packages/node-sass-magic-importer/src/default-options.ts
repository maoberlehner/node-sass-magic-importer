import { ICustomFilter } from 'css-node-extract/src/interfaces/ICustomFilter';

export const defaultOptions: {
  cwd: string;
  extensions: string[];
  packageKeys: string[];
  packagePrefix: string;
  disableImportOnce: boolean;
  customFilters?: ICustomFilter[];
} = {
  cwd: process.cwd(),
  extensions: [
    `.scss`,
    `.sass`,
    `.css`,
  ],
  packageKeys: [
    `sass`,
    `scss`,
    `style`,
    `css`,
    `main.sass`,
    `main.scss`,
    `main.style`,
    `main.css`,
    `main`,
  ],
  packagePrefix: `~`,
  disableImportOnce: false,
  customFilters: undefined,
};
