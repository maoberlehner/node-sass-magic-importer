import path from 'path';
import uniqueConcat from 'unique-concat';

import defaultOptions from './lib/default-options';
import MagicImporter from './lib/magic-importer';
import storeClear from './lib/store-clear';

/**
 * Magic importer for node-sass.
 *
 * @param {Object} customOptions
 *   Custom configuration options.
 * @return {Function}
 *   node-sass custom importer function.
 */
export default (customOptions = {}) => {
  const options = Object.assign({}, defaultOptions, customOptions);
  const magicImporter = new MagicImporter(options);

  storeClear();

  /**
   * @param {string} url
   *   The path in import as-is, which LibSass encountered.
   * @param {string} prev
   *   The previously resolved path.
   * @return {Object|null}
   *   node-sass custom importer data object or null.
   */
  return function importer(url, prev) {
    const nodeSassIncludePaths = this.options.includePaths.split(path.delimiter);

    if (path.isAbsolute(prev)) nodeSassIncludePaths.push(path.dirname(prev));
    magicImporter.options.includePaths = uniqueConcat(
      options.includePaths,
      nodeSassIncludePaths
    ).filter(item => item.length);

    return magicImporter.resolveSync(url);
  };
};
