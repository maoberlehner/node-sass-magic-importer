import path from 'path';
import uniqueConcat from 'unique-concat';

import defaultOptions from './lib/default-options';
import MagicImporter from './lib/magic-importer';

/**
 * Magic importer for node-sass.
 *
 * @param {Object} customOptions
 *   Custom configuration options.
 * @return {Function}
 *   node-sass custom importer function.
 */
export default (customOptions = {}) => {
  let importerInstanceId = 1;
  const options = Object.assign({}, defaultOptions, customOptions);
  const magicImporter = new MagicImporter(options);

  /**
   * @param {string} url
   *   The path in import as-is, which LibSass encountered.
   * @param {string} prev
   *   The previously resolved path.
   * @return {Object|null}
   *   node-sass custom importer data object or null.
   */
  return function importer(url, prev) {
    if (!this.magicImporterInstanceId) {
      this.magicImporterInstanceId = importerInstanceId;
      importerInstanceId += 1;
    }
    const nodeSassIncludePaths = this.options.includePaths.split(path.delimiter);

    if (path.isAbsolute(prev)) nodeSassIncludePaths.push(path.dirname(prev));
    magicImporter.options.includePaths = uniqueConcat(
      options.includePaths,
      nodeSassIncludePaths
    ).filter(item => item.length);

    return magicImporter.resolveSync(url, this.magicImporterInstanceId);
  };
};
