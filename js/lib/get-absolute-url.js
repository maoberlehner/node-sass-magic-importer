export function getAbsoluteUrl({ path, getSassFileGlobPattern, glob }, url, includePaths = []) {
  const { dir, base } = path.parse(url);
  const baseGlobPattern = getSassFileGlobPattern(base);
  includePaths.some((includePath) => {
    glob.sync(path.resolve(includePath, dir, baseGlobPattern));
    return false;
  });
}

export default function getAbsoluteUrlFactory() {
  return getAbsoluteUrl.bind(null);
}
