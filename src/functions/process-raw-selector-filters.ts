import escapeSelector from './escape-selector';

import { ISelectorFilter, ISelectorFilterRaw } from '../interfaces/ISelectorFilter';

export interface IDependencies {
  escapeSelector: typeof escapeSelector;
}

export function processRawSelectorFilters(
  { escapeSelector }: IDependencies,
  rawSelectorFilters: ISelectorFilterRaw[],
) {
  return rawSelectorFilters.map((rawSelectorFilter) => {
    const selectorFilter: ISelectorFilter = { selector: ``, replacement: undefined };
    const matchRegExpSelector = rawSelectorFilter.selector.match(/^\/(.+)\/([a-z]*)$/);

    if (matchRegExpSelector) {
      const pattern = escapeSelector(matchRegExpSelector[1], `\\\\`);
      const flags = matchRegExpSelector[2];
      selectorFilter.selector = new RegExp(pattern, flags);
    } else {
      selectorFilter.selector = escapeSelector(rawSelectorFilter.selector);
    }

    selectorFilter.replacement = escapeSelector(rawSelectorFilter.replacement);

    return selectorFilter;
  });
}

export function processRawSelectorFiltersFactory(dependencies: IDependencies): (
  rawSelectorFilters: ISelectorFilterRaw[],
) => ISelectorFilter[] {
  return processRawSelectorFilters.bind(null, dependencies);
}

export default processRawSelectorFiltersFactory({ escapeSelector });
