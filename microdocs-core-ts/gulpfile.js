'use strict';

var gulp = require('gulp');
var typescript = require('gulp-typescript');
var embedTemplates = require('gulp-angular-embed-templates');
var clean = require('gulp-clean');
var merge = require('merge2');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var tscConfig = require('./src/tsconfig.json');

var settings = {
  distFolder: 'dist'
};

gulp.task('default', ['compile'], function () {
  gulp.watch(['src/**/*.ts', 'src/**/*.html'], ['compile-typescript']);
});

gulp.task('compile', function (done) {
  runSequence('clean', 'compile-typescript', done);
});

gulp.task('compile-typescript', [], function () {
  gulp.src('src/systemjs.config.js').pipe(gulp.dest(settings.distFolder));

  // copy all compiled typescript code
  var result = gulp
      .src(['typings/index.d.ts', 'src/**/*.ts'])
      .pipe(plumber())
      .pipe(typescript(tscConfig.compilerOptions));

  return merge([
    result.dts.pipe(gulp.dest(settings.distFolder)),
    result.js.pipe(embedTemplates({sourceType: 'js'})).pipe(gulp.dest(settings.distFolder))
  ]);
});

gulp.task('clean', [], function () {
  /**
   * hard clean of all folders and files
   * only files in /src are kept
   * and gulpfile.js, package.json, readme.md, tsconfig.json in the root directory
   */
  return gulp.src(['dist/'], {read: false}).pipe(clean());
});

gulp.task('test', [], function () {

});