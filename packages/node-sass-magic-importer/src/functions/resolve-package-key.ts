import { IResolvePackageKey } from '../interfaces/IResolvePackageKey';

export function resolvePackageKeyFactory(): IResolvePackageKey {
  return (packageJson: any, packageKeys: string[]) => {
    const packageKey = packageKeys.find((x) => packageJson[x]);

    if (packageKey) {
      return Object.assign({}, packageJson, { main: packageJson[packageKey] });
    }

    return packageJson;
  };
}
