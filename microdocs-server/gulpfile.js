'use strict';
var gulp = require('gulp');
var tscConfig = require('./src/tsconfig.json');
var Builder = require('./node_modules/@maxxton/microdocs-core/build').Builder;

var settings = {
  distFolder: 'dist',
  projectName: 'microdocs-server',
  tsConfig: tscConfig
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
// gulp.task('buildMicroDocs', function(){
//   mxtBuilder.buildMicroDocs();
// });
//
// gulp.task('checkMicroDocs', function(){
//   mxtBuilder.checkMicroDocs({
//     url: 'https://microdocs.maxxton.com'
//   });
// });