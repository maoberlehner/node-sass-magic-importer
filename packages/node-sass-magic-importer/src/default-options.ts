export const defaultOptions: {
  cwd: string;
  extensions: string[];
  packageKeys: string[];
  packagePrefix: string;
  disableImportOnce: boolean;
} = {
  cwd: process.cwd(),
  extensions: [
    `.scss`,
    `.sass`,
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
};
