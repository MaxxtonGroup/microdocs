'use strict';
var gulp = require('gulp');
var tscConfig = require('./src/tsconfig.json');
var Builder = require('./node_modules/@maxxton/microdocs-core/build').Builder;

var settings = {
  distFolder: 'dist',
  projectName: 'microdocs-cli',
  tsConfig: tscConfig,
  src: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/test/**'],
  srcResources: [],
  test: ['src/**/*.spec.ts'],
  testResources: ['src/test/**']
};

var builder = new Builder(settings);

gulp.task('default', ['prepublish'], function (cb) {
  builder.watch(cb);
});

gulp.task('test', function (cb) {
  builder.test(cb);
});

gulp.task('watchTest', function (cb) {
  builder.watchTest(cb);
});

/**
 * Cleans, moves, and compiles the code
 */
gulp.task('prepublish', function (cb) {
  builder.prepublish(cb);
});