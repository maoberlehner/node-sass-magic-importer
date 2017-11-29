import { ICleanImportUrl } from '../interfaces/ICleanImportUrl';

export function cleanImportUrlFactory(): ICleanImportUrl {
  return (url: string) => {
    const importUrl = url.split(` from `).pop() as string;

    return importUrl.trim();
  };
}
