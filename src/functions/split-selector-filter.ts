import { ISelectorFilterRaw } from '../interfaces/ISelectorFilter';

export function splitSelectorFilter(combinedFilter: string): ISelectorFilterRaw {
  const [selector, replacement] = combinedFilter.split(` as `)
    .map((x) => x.trim());

  return {
    selector,
    replacement,
  };
}

export function splitSelectorFilterFactory(): typeof splitSelectorFilter {
  return splitSelectorFilter.bind(null);
}

export default splitSelectorFilterFactory();
