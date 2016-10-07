'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var typescript = require('gulp-typescript');
var embedTemplates = require('gulp-angular-embed-templates');
var clean = require('gulp-clean');
var merge = require('merge2');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var tscConfig = require('./src/tsconfig.json');
var fs = require('fs');
var mocha = require('gulp-mocha');

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

gulp.task('test', ['compile-typescript'], function () {
  return gulp.src(['dist/test/*.js'], { read: false })
      .pipe(mocha({ reporter: 'list' }))
      .on('error', gutil.log);
});

/**
 * Cleans, moves, and compiles the code
 */
gulp.task('prepublish', function (done) {
  runSequence('clean', 'prepublish-package', 'compile-typescript', 'test', done);
});

/**
 * Copy part of the package.json to the dist folder for publishing.
 */
gulp.task('prepublish-package', function () {
  var json = JSON.parse(fs.readFileSync('./package.json'));
  var publishJson = {
    name: json.name,
    version: json.version,
    description: json.description,
    author: json.author,
    license: json.license,
    publishConfig: json.publishConfig,
    peerDependencies: json.dependencies
  };

  var src = require('stream').Readable({objectMode: true})
  src._read = function () {
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: "package.json",
      contents: new Buffer(JSON.stringify(publishJson, null, 2))
    }))
    this.push(null)
  }
  src.pipe(gulp.dest('dist/'));
});