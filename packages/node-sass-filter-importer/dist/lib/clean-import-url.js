'use strict';

/**
 * Clean an import url from filters.
 *
 * @param {String} url
 *   Import url from node-sass.
 * @return {String}
 *   Cleaned up node-sass import url.
 */
function cleanImportUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  var cleanUrl = url.split("from").reverse()[0].trim();

  return cleanUrl;
}

module.exports = cleanImportUrl;
