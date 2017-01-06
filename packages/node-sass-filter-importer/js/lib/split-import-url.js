export default (url = ``) => {
  const urlParts = url
    .split(`from`)
    .reverse()
    .map(item => item.trim());

  return urlParts;
};
