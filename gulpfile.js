const gulp = require('gulp');
const path = require('path');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const chalk = require('chalk');
const yargs = require('yargs');

const flags = yargs
  .boolean('watch')
  .describe('watch', '是否监听文件变化')
  .default('watch', false)
  .argv;

const  STARTBUILD = chalk.yellow('>>>>>>>>  build   <<<<<<<<');
const    ENDBUILD = chalk.yellow('>>>>>>>>  build   <<<<<<<<');
const STARTMINIFY = chalk.yellow('>>>>>>>>  minify  <<<<<<<<');
const   ENDMINIFY = chalk.yellow('>>>>>>>>  minify  <<<<<<<<');
const buildTask = [
  {
    name: 'jcc2d',
    entry: "src/index.js",
    dest: "build/jcc2d.js",
  },
  {
    name: 'jcc2d.light',
    entry: "src/index.light.js",
    dest: "build/jcc2d.light.js",
  },
];


gulp.task('build', function () {
  console.log(STARTBUILD);
  const queue = buildTask.map(({name, entry, dest}) => {
    return new Promise((res, rej)=>{
      console.log(chalk.cyan(`${name} building...`));
      rollup.rollup({
        entry,
        plugins: [
          babel({
            exclude: 'node_modules/**', // only transpile our source code
          }),
        ],
      })
      .then((bundle) => {
        bundle.write({
          format: "umd",
          moduleName: 'JC',
          dest,
          sourceMap: true
        });
        res();
        console.log(chalk.cyan(`${name} build end`));
      })
    });
  });
  return Promise.all(queue)
  .then(() => {
    console.log(ENDBUILD);
  });
});

gulp.task('minify', ['build'], function() {
  console.log(STARTMINIFY);
  const queue = buildTask.map(({dest}) => {
    return gulp.src(dest)
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.dirname(dest)));
  });
  return Promise.all(queue)
  .then(() => {
    console.log(ENDMINIFY);
  });
});

if (flags.watch) {
  gulp.watch('src/**/*.js', ['build']);
}

gulp.task('release', [ 'minify' ]);
