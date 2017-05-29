import { ISelectorFilterRaw } from '../interfaces/ISelectorFilter';
import { ISplitSelectorFilter } from '../interfaces/ISplitSelectorFilter';

export function splitSelectorFilterFactory(): ISplitSelectorFilter {
  return (combinedFilter: string): ISelectorFilterRaw => {
    const [selector, replacement] = combinedFilter.split(` as `)
      .map((x) => x.trim());

    return {
      selector,
      replacement,
    };
  };
}
