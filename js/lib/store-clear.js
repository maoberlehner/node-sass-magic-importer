import storeModule from './store';

function storeClear({ store }) {
  // eslint-disable-next-line no-param-reassign
  store.length = 0;
}

export function storeClearFactory(dependencies) {
  return storeClear.bind(null, dependencies);
}

export default storeClear.bind(null, {
  store: storeModule,
});
