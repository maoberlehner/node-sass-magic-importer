import pathModule from 'path';

function sassGlobPattern({ path }, base) {
  const { name, ext } = path.parse(base);
  if (ext) return base;

  return `?(_)${name}@(.css|.sass|.scss)`;
}

export function sassGlobPatternFactory(dependencies) {
  return sassGlobPattern.bind(null, dependencies);
}

export default sassGlobPattern.bind(null, {
  path: pathModule,
});
