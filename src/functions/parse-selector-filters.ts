import processRawSelectorFilters from './process-raw-selector-filters';
import splitSelectorFilter from './split-selector-filter';

import { ISelectorFilter, ISelectorFilterRaw } from '../interfaces/ISelectorFilter';

export interface IDependencies {
  processRawSelectorFilters: typeof processRawSelectorFilters;
  splitSelectorFilter: typeof splitSelectorFilter;
}

export function parseSelectorFilters(
  { processRawSelectorFilters, splitSelectorFilter }: IDependencies,
  url: string,
) {
  const selectorFiltersMatch = url.match(/{([\s\S]*)}/);

  if (!selectorFiltersMatch) {
    return [];
  }

  const rawSelectorFilters = selectorFiltersMatch[1].split(`,`)
    .map((x) => splitSelectorFilter(x.trim()));

  return processRawSelectorFilters(rawSelectorFilters);
}

export function parseSelectorFiltersFactory(dependencies: IDependencies): (
  url: string,
) => ISelectorFilter[] {
  return parseSelectorFilters.bind(null, dependencies);
}

export default parseSelectorFiltersFactory({ processRawSelectorFilters, splitSelectorFilter });
