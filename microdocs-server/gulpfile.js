'use strict';
var gulp = require('gulp');
var tscConfig = require('./src/tsconfig.json');
var mxtBuilder = require("@maxxton/gulp-builder");

mxtBuilder.setSettings({
  distFolder: 'dist',
  projectName: 'microdocs-server',
  tsConfig: tscConfig
});

gulp.task('default', ['prepublish'], function (cb) {
  mxtBuilder.watch(cb);
});

// TEMPORARY SOLUTION FOR LINKING NPM MODULES TO DEVELOPMENT
gulp.task('link', function (cb) {
  mxtBuilder.link(cb);
});

gulp.task('lint', function (cb) {
  mxtBuilder.lint(cb);
});

gulp.task('bundle-javascript', function (cb) {
  mxtBuilder.bundleJavascript(cb);
});

gulp.task('test', function (db) {
  mxtBuilder.test(db, 'mocha')
});

/**
 * Cleans, moves, and compiles the code
 */
gulp.task('prepublish', function (cb) {
  mxtBuilder.prepublish(cb);
});


gulp.task('buildMicroDocs', function(){
  mxtBuilder.buildMicroDocs();
});

gulp.task('checkMicroDocs', function(){
  mxtBuilder.checkMicroDocs({
    url: 'https://microdocs.maxxton.com'
  });
});