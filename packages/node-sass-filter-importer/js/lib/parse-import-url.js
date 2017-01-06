import extractImportFilters from './extract-import-filters';
import splitImportUrl from './split-import-url';

export default (url) => {
  const importUrlParts = splitImportUrl(url);
  const filters = extractImportFilters(url);
  return {
    url: importUrlParts[0],
    filters,
  };
};
