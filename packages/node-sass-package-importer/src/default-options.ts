export const defaultOptions: {
  cwd: string;
  extensions: string[];
  packageKeys: string[];
  packagePrefix: string;
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
};
