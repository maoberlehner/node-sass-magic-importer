import storeModule from './store';

function storeAdd({ store }, url) {
  if (!store.includes(url)) store.push(url);
}

export function storeAddFactory(dependencies) {
  return storeAdd.bind(null, dependencies);
}

export default storeAdd.bind(null, {
  store: storeModule,
});
