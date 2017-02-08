export function getAbsoluteUrl({ path }, url) {
  path.parse(url);
}

export default function getAbsoluteUrlFactory() {
  return getAbsoluteUrl.bind(null);
}
