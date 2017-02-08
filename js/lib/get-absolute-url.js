export function getAbsoluteUrl() {}

export default function getAbsoluteUrlFactory() {
  return getAbsoluteUrl.bind(null);
}
