
// import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'build/jcc2d.js',
  moduleName: 'JC',
  format: 'umd',
  sourceMap: true,
  plugins: [
    // resolve(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
};
