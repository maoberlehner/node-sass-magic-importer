import { ISelectorFilter, ISelectorFilterRaw } from './ISelectorFilter';

export type IProcessRawSelectorFilters = (
  rawSelectorFilters: ISelectorFilterRaw[],
) => ISelectorFilter[];
