import buble from 'rollup-plugin-buble';

export default {
  exports: 'named',
  plugins: [
    buble()
  ]
};
