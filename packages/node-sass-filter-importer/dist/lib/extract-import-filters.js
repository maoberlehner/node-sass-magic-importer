'use strict';

/**
 * Extract import filters from a string.
 *
 * @param {String} string
 *   A string that may contains import filters.
 * @return {Array}
 *   Array of found import filters.
 */
function extractImportFilters() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  var filterMatch = string.match(/\[([\s\S]*)]/);

  if (filterMatch && filterMatch[1]) {
    return filterMatch[1].split(",").map(function (item) {
      return item.trim();
    });
  }

  return [];
}

module.exports = extractImportFilters;
