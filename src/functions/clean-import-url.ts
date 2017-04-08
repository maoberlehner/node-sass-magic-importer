export function cleanImportUrl(url: string) {
  return url.split(` from `).pop().trim();
}

export function cleanImportUrlFactory(): (
  url: string,
) => string {
  return cleanImportUrl.bind(null);
}

export default cleanImportUrlFactory();
