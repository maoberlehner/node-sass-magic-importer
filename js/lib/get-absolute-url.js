export function getAbsoluteUrl({ path, getSassFileGlobPattern }, url, includePaths = []) {
  const { dir, base } = path.parse(url);
  const baseGlobPattern = getSassFileGlobPattern(base);
  includePaths.some((includePath) => {
    path.resolve(includePath, dir, baseGlobPattern);
    return false;
  });
}

export default function getAbsoluteUrlFactory() {
  return getAbsoluteUrl.bind(null);
}
