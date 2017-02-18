import pathModule from 'path';

export function sassGlobPattern({ path }, base) {
  const { name, ext } = path.parse(base);
  if (ext) return base;

  return `?(_)${name}@(.css|.sass|.scss)`;
}

export default sassGlobPattern.bind(null, {
  path: pathModule,
});
