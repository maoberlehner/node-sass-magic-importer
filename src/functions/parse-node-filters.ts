export function parseNodeFilters(url: string) {
  const nodeFiltersMatch = url.match(/\[([\s\S]*)\]/);

  if (!nodeFiltersMatch) {
    return [];
  }

  return nodeFiltersMatch[1].split(`,`)
    .map((x) => x.trim());
}

export function parseNodeFiltersFactory(): (
  url: string,
) => string[] {
  return parseNodeFilters.bind(null);
}

export default parseNodeFiltersFactory();
