export default (url = ``) => {
  const cleanUrl = url
    .split(`from`)
    .reverse()[0]
    .trim();

  return cleanUrl;
};
