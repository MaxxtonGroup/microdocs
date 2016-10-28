'use strict';
var gulp = require('gulp');
var tscConfig = require('./src/tsconfig.json');
var mxtBuilder = require("@maxxton/gulp-builder");
var async = require('async');

mxtBuilder.setSettings({
  env: 'development',
  distFolder: 'dist',
  projectName: 'microdocs-ui',
  tsConfig: tscConfig,
  serverPort: 7000,
  appFolder: 'app'
});

gulp.task('default', function (cb) {
  async.series([
    function (next) {
      mxtBuilder.clean(next);
    },
    function (next) {
      mxtBuilder.buildDeploy(next);
    },
    function (next) {
      mxtBuilder.run(next);
    },
    function (next) {
      mxtBuilder.watch(next);
    }
  ], cb);
});

gulp.task('runWatch', function (cb) {
  async.series([
    function (next) {
      mxtBuilder.run(next);
    },
    function (next) {
      mxtBuilder.watch(next);
    },
  ], cb);
});

gulp.task('test', function (cb) {
  mxtBuilder.test(cb);
});

gulp.task('e2e', function (cb) {
  mxtBuilder.e2e(cb);
});

gulp.task('package-distribution-development', function (cb) {
  mxtBuilder.packageDistribution('development', cb);
});
gulp.task('package-distribution-acceptance', function (cb) {
  mxtBuilder.packageDistribution('acceptance', cb);
});
gulp.task('package-distribution-production', function (cb) {
  mxtBuilder.packageDistribution('production', cb);
});

gulp.task('lint', function (cb) {
  mxtBuilder.lint(cb);
});

gulp.task('buildMicroDocs', function(){
  mxtBuilder.buildMicroDocs();
});

gulp.task('checkMicroDocs', function(){
  mxtBuilder.checkMicroDocs({
    url: 'https://microdocs.maxxton.com'
  });
});