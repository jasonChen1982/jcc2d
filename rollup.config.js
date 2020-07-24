
import babel from 'rollup-plugin-babel';
// import {uglify} from 'rollup-plugin-uglify';

export default [
  {
    input: 'src/index.js',
    output: {
      format: 'umd',
      name: 'JC',
      extend: true,
      sourcemap: true,
      file: 'build/jcc2d.js',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', {modules: false}]],
        plugins: ['@babel/plugin-external-helpers', '@babel/plugin-proposal-object-rest-spread'],
      }),
      // uglify(),
    ],
    watch: {
      exclude: ['node_modules/**'],
    },
  },
  // {
  //   input: 'src/index.js',
  //   output: {
  //     format: 'umd',
  //     name: 'JC',
  //     extend: true,
  //     sourcemap: true,
  //     file: 'build/jcc2d.js',
  //   },
  //   plugins: [
  //     babel({
  //       exclude: 'node_modules/**',
  //       presets: [['@babel/preset-env', {modules: false}]],
  //       plugins: ['@babel/plugin-external-helpers', '@babel/plugin-proposal-object-rest-spread'],
  //     }),
  //     uglify(),
  //   ],
  //   watch: {
  //     exclude: ['node_modules/**'],
  //   },
  // },
];
