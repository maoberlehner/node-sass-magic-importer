import path from 'path';
import uniqueConcat from 'unique-concat';

import defaultOptions from './lib/default-options';
import FilterImporter from './lib/filter-importer';

/**
 * Filter importer for node-sass.
 *
 * @param {Object} customOptions
 *   Custom configuration options.
 * @return {Object|null}
 *   Contents object or null.
 */
export default (customOptions = {}) => function importer(url, prev) {
  const options = Object.assign({}, defaultOptions, customOptions);
  const nodeSassIncludePaths = this.options.includePaths.split(path.delimiter);

  if (path.isAbsolute(prev)) nodeSassIncludePaths.push(path.dirname(prev));
  options.includePaths = uniqueConcat(options.includePaths, nodeSassIncludePaths)
    .filter(item => item.length);

  const filterImporter = new FilterImporter(options);
  return filterImporter.resolveSync(url);
};
