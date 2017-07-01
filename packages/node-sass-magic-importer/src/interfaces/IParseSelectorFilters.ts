import { ISelectorFilter } from './ISelectorFilter';

export type IParseSelectorFilters = (
  url: string,
) => ISelectorFilter[];
