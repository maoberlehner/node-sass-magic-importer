export default (string = ``) => {
  const filterMatch = string
    .match(/\[([\s\S]*)]/);

  if (filterMatch && filterMatch[1]) {
    return filterMatch[1].split(`,`).map(item => item.trim());
  }

  return [];
};
