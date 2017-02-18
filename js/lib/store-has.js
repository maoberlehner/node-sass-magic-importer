import storeModule from './store';

function storeHas({ store, console }, url, hasFilters = false, showWarnings = true) {
  if (!hasFilters && store.includes(url)) return true;

  if (hasFilters && store.includes(url)) {
    if (showWarnings) {
      // eslint-disable-next-line no-console
      console.warn(`Warning: double import of file "${url}".`);
    }
  }

  return false;
}

export function storeHasFactory(dependencies) {
  return storeHas.bind(null, dependencies);
}

export default storeHas.bind(null, {
  store: storeModule,
  console,
});
