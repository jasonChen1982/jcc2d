var gulp = require('gulp'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    pkg = require('./package.json');



gulp.task('release', function() {
    return gulp.src('build/jcc2d.js')
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.dirname(pkg.main)));
});
