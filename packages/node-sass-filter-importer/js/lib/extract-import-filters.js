/**
 * Extract import filters from a string.
 *
 * @param {String} string
 *   A string that may contains import filters.
 * @return {Array}
 *   Array of found import filters.
 */
export default function extractImportFilters(string = ``) {
  const filterMatch = string.match(/\[([\s\S]*)]/);

  if (filterMatch && filterMatch[1]) {
    return filterMatch[1].split(`,`).map(item => item.trim());
  }

  return [];
}
