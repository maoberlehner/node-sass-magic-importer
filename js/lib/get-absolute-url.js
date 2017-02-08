export function getAbsoluteUrl({ path, getSassFileGlobPattern }, url) {
  const { base } = path.parse(url);
  getSassFileGlobPattern(base);
}

export default function getAbsoluteUrlFactory() {
  return getAbsoluteUrl.bind(null);
}
