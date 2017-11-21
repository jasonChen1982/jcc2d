/* eslint-env node */
const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const uglify = require('uglify-js');
const babel = require('rollup-plugin-babel');

const BANNER = `
/**
 * jcc2d.js
 * (c) 2014-${new Date().getFullYear()} jason chen
 * Released under the MIT License.
 */
`;

const TASKS = [
  {
    input: 'src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    output: {
      name: 'JC',
      format: 'umd',
      file: 'build/jcc2d.js',
      sourcemap: true,
      minify: true,
      banner: BANNER,
    },
  },
  {
    input: 'src/index.light.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    output: {
      name: 'JC',
      format: 'umd',
      file: 'build/jcc2d.light.js',
      sourcemap: true,
      minify: true,
      banner: BANNER,
    },
  },
  {
    input: 'src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    output: {
      format: 'es',
      file: 'esm/jcc2d.js',
      sourcemap: true,
      banner: BANNER,
    },
  },
];

build(TASKS);

/**
 *
 * @param {Array} tasks 构建任务队列
 */
function build(tasks) {
  let built = 0;
  const total = tasks.length;
  const next = () => {
    runner(tasks[built]).then(() => {
      built++;
      if (built < total) {
        next();
      }
    }).catch(logError);
  };

  next();
}

/**
 *
 * @param {Object} config 构建配置
 * @return {Promise}
 */
function runner(config) {
  const output = config.output;
  const {file, banner, minify} = output;
  return rollup.rollup(config)
    .then(({generate, write}) => {
      write(output);
      return write(output).then(() => {
        return generate(output);
      });
    })
    .then(({code}) => {
      if (!minify) {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
      const fileMin = file.replace('.js', '.min.js');
      console.log(fileMin);
      const {error, warnings, code: codes, map} = uglify.minify(code, {
        sourceMap: {
          url: path.basename(fileMin + '.map'),
        },
      });
      if (error || warnings) {
        if (error) console.log(error);
        if (warnings) console.log(warnings);
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
      const minified = (banner ? banner + '\n' : '') + codes;
      return write(resolve(fileMin), minified)
        .then(() => write(resolve(fileMin) + '.map', map));
    });
}

/**
 *
 * @param {String} file 写入的文件名
 * @param {String} code 写入的文件内容
 * @return {Promise}
 */
function write(file, code) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, code, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 *
 * @param {String} e error 信息
 */
function logError(e) {
  console.error(e);
}

/**
 * @param {String} file 写入的文件名
 * @return {String}
 */
function resolve(file) {
  return path.resolve(process.cwd(), file);
}
