'use strict';
var gulp = require('gulp');
var tscConfig = require('./src/tsconfig.json');
var Builder = require('./src/build').Builder;

var settings = {
  distFolder: 'dist',
  projectName: 'microdocs-core',
  tsConfig: tscConfig,
  srcResources: ['package.json', 'LICENSE','README.md', 'src/**/*.js']
};

var builder = new Builder(settings);

gulp.task('default', ['prepublish'], function (cb) {
  builder.watch(cb);
});

gulp.task('test', function (cb) {
  builder.test(cb);
});

/**
 * Cleans, moves, and compiles the code
 */
gulp.task('prepublish', function (cb) {
  builder.prepublish(cb);
});