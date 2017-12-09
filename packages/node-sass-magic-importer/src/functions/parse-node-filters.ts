import { IFilterParser } from '../interfaces/IFilterParser';

export function parseNodeFiltersFactory(): IFilterParser {
  return (url: string) => {
    const filterDivider = /[\n\r\s]+from[\n\r\s]+/;

    if (!filterDivider.test(url)) {
      return [];
    }

    const nodeFiltersMatch = url
      .split(filterDivider)[0]
      .replace(/{.*?\/.*?\/.*?}/, ``)
      .match(/\[([\s\S]*)\]/);

    if (!nodeFiltersMatch) {
      return [];
    }

    return nodeFiltersMatch[1].split(`,`)
      .map((x) => x.trim())
      .filter((x) => x.length);
    };
}
