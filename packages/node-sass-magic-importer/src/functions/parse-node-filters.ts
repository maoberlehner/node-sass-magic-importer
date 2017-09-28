import { IFilterParser } from '../interfaces/IFilterParser';

export function parseNodeFiltersFactory(): IFilterParser {
  return (url: string) => {
    const nodeFiltersMatch = url
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
