import extractImportFilters from './extract-import-filters';
import cleanImportUrl from './clean-import-url';

export default (url) => {
  const cleanUrl = cleanImportUrl(url);
  const filters = extractImportFilters(url);

  return {
    url: cleanUrl,
    filters,
  };
};
