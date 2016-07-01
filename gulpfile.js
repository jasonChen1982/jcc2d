var gulp = require('gulp'),
  path = require('path'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  include = require('gulp-include'),
  pkg = require('./package.json');


gulp.task('build', function() {
  return gulp.src('src/jcc2d.js')
    .pipe(sourcemaps.init())
    .pipe(include())
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(path.dirname(pkg.main)))
    .pipe(gulp.dest('examples/libs'));
});

var jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function (cb) {
    gulp.src(['README.md', 'src/modules/*.js'], {read: false})
        .pipe(jsdoc(cb));
});