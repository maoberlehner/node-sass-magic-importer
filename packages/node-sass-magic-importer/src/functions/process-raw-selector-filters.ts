import { IEscapeSelector } from '../interfaces/IEscapeSelector';
import { IProcessRawSelectorFilters } from '../interfaces/IProcessRawSelectorFilters';
import { ISelectorFilter, ISelectorFilterRaw } from '../interfaces/ISelectorFilter';

export function processRawSelectorFiltersFactory(
  escapeSelector: IEscapeSelector,
): IProcessRawSelectorFilters {
  return (rawSelectorFilters: ISelectorFilterRaw[]) => {
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
  };
}
