/**
 * Clean an import url from filters.
 *
 * @param {String} url
 *   Import url from node-sass.
 * @return {String}
 *   Cleaned up node-sass import url.
 */
export default function cleanImportUrl(url = ``) {
  const cleanUrl = url
    .split(`from`)
    .reverse()[0]
    .trim();

  return cleanUrl;
}
