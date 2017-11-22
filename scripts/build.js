/* eslint-env node */
const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const uglify = require('uglify-js');
const babel = require('rollup-plugin-babel');
const chokidar = require('chokidar');
const chalk = require('chalk');
const yargs = require('yargs');

const flags = yargs
  .boolean('watch')
  .describe('watch', '是否监听文件变化')
  .default('watch', false)
  .argv;
const BANNER = `
/**
 * jcc2d.js
 * (c) 2014-${new Date().getFullYear()} jason chen
 * Released under the MIT License.
 */
`;
const TASKS = [
  {
    entry: 'src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    targets: {
      moduleName: 'JC',
      format: 'umd',
      dest: 'build/jcc2d.js',
      sourceMap: true,
      minify: true,
      banner: BANNER,
    },
  },
  {
    entry: 'src/index.light.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    targets: {
      moduleName: 'JC',
      format: 'umd',
      dest: 'build/jcc2d.light.js',
      sourceMap: true,
      minify: true,
      banner: BANNER,
    },
  },
  {
    entry: 'src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    targets: {
      format: 'es',
      dest: 'esm/jcc2d.js',
      sourceMap: true,
      banner: BANNER,
    },
  },
];
const TS = [1000, 60, 60];
const TU = ['ms', 's', 'min'];

build(TASKS);

if (flags.watch) {
  chokidar.watch('src/**/*.js').on('change', () => {
    console.log('\nrebuilding source code...');
    build(TASKS);
  });
}

/**
 *
 * @param {Array} tasks 构建任务队列
 */
function build(tasks) {
  let built = 0;
  const total = tasks.length;
  const next = () => {
    return runner(tasks[built]).then(() => {
      built++;
      if (built < total) {
        console.log('');
        return next();
      }
    }).catch(logError);
  };

  next().then(() => {
    if (flags.watch) console.log('\nwaiting for change ...');
  });
}

/**
 *
 * @param {Object} config 构建配置
 * @return {Promise}
 */
function runner(config) {
  const targets = config.targets;
  const {dest, banner, minify} = targets;
  let st = Date.now();
  return rollup.rollup(config)
    .then(({generate, write}) => {
      return write(targets).then(() => {
        console.log(title(
          'compile',
          config.entry,
          dest,
          addUnit(Date.now() - st)
        ));
        return generate(targets);
      });
    })
    .then(({code}) => {
      if (!minify) {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
      st = Date.now();
      const fileMin = dest.replace('.js', '.min.js');
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
        .then(() => {
          console.log(title(
            ' minify',
            dest,
            fileMin,
            addUnit(Date.now() - st)
          ));

          const fileMap = fileMin + '.map';
          return write(resolve(fileMap), map).then(() => {
            console.log(title(
              ' sourcemap',
              dest,
              fileMap,
              addUnit(Date.now() - st)
            ));
          });
        });
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

/**
 *
 * @param {String} title 标题
 * @param {String} from 源文件
 * @param {String} dest 目标文件
 * @param {String} time 耗时
 * @return {String}
 */
function title(title, from, dest, time) {
  /* eslint max-len: 0 */
  return chalk.red(`${title}: ${chalk.yellow(from)} → ${chalk.yellow(dest)} in ${chalk.cyan(time)}`);
}

/**
 *
 * @param {Number} valve 元数据
 * @param {Number|Array} spaces 单位制
 * @param {Array} units 单位
 * @return {String}
 */
function addUnit(valve, spaces, units) {
  spaces = spaces || TS;
  units = units || TU;
  let unit = 0;
  const notsame = spaces instanceof Array;
  if (valve <=0 ) return '0' + units[0];
  let space = notsame ? spaces[unit] : spaces;
  while (valve > space) {
    valve /= space;
    unit++;
    space = notsame ? notsame[unit] : spaces;
  }
  const showValue = Math.floor(valve * 100) / 100;
  return showValue + units[unit];
}
