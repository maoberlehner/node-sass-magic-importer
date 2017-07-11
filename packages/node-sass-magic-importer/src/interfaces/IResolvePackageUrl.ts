export type IResolvePackageUrl = (
  url: string,
  extensions: string[],
  cwd: string,
  packageKeys: any,
) => string|null;
