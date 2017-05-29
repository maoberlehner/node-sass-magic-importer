import { ISelectorFilterRaw } from './ISelectorFilter';

export type ISplitSelectorFilter = (
  combinedFilter: string,
) => ISelectorFilterRaw;
