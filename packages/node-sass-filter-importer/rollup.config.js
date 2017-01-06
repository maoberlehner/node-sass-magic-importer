import babel from 'rollup-plugin-babel';

export default {
  plugins: [
    babel({
      babelrc: false,
      presets: [
        [`es2015`, { modules: false }],
      ],
    }),
  ],
};
