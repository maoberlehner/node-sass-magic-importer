export function cleanImportUrl(url: string) {
  const importUrl = url.split(` from `).pop() || ``;
  return importUrl.trim();
}

export function cleanImportUrlFactory(): typeof cleanImportUrl {
  return cleanImportUrl.bind(null);
}

export default cleanImportUrlFactory();
