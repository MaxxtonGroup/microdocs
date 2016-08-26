'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var async   = require( 'async' );
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var liveserver = require('gulp-connect');
var embedTemplates = require('gulp-angular-embed-templates');
var sass = require('gulp-sass');
var merge = require('merge2');
var clean = require('gulp-rimraf');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var fs = require("fs");
var nodemon = require('gulp-nodemon');
const tscConfig = require('./src/tsconfig.json');
var mocha = require('gulp-mocha');

var settings = {
  env: 'development',
  distFolder: 'dist'
};

var tsProjectConf = typescript.createProject('./src/tsconfig.json');

gulp.task('default', function (done) {
  runSequence('clean', 'compile', 'config-development', 'run', 'watch', done);
});

gulp.task('compile', ['test']);

gulp.task('compile-typescript', ['compile-pug'], function () {
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

gulp.task('compile-pug', [], function () {

    return gulp.src('src/views/**')
        .pipe(gulp.dest(settings.distFolder + '/views'));

});

gulp.task('compile-sourcemaps', [], function (done) {
  var generatedSourceMaps;
  //if it's not development we add all .min.js sourcemaps.
  if (settings.env !== 'development') {
    generatedSourceMaps = gulp.src([settings.distFolder + '/**/*.min.js'])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.', {sourceRoot: '/node_modules/'}))
  }
  //if it's develop we add all sourcemaps
  else {
    generatedSourceMaps = gulp.src([settings.distFolder + '/**/*.js', settings.distFolder + '/**/*.css'])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.', {sourceRoot: '/'}))
  }
  generatedSourceMaps.pipe(gulp.dest(settings.distFolder))
      .on('finish', function () {
        done();
      });
});

gulp.task('run', function () {
  nodemon({
    script: 'index.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  })
      .on('start', ['watch'])
      .on('change', ['watch'])
      .on('restart', function () {
        console.log('restarted!');
      });
});

/**
 * These tasks copy the corresponding configuration file, based on the env you're setting up.
 */
gulp.task('config-development', ['set-dev-env', 'config']);
gulp.task('config-acceptance', ['set-acc-env', 'config']);
gulp.task('config-production', ['set-prod-env', 'config']);
gulp.task('set-dev-env', function () {
  settings.env = 'development';
});
gulp.task('set-acc-env', function () {
  settings.env = 'acceptance';
});
gulp.task('set-prod-env', function () {
  settings.env = 'production';
});
gulp.task('config', function () {
  return gulp.src('src/config/config-' + settings.env + '.ts')
      .pipe(rename('config.ts'))
      .pipe(typescript(tsProjectConf))
      .pipe(gulp.dest('dist/config'));
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.ts', 'src/**/*.html', 'src/views/**'], ['compile-typescript']);
});

gulp.task('clean', [], function () {
  return gulp.src(settings.distFolder, {read: false}).pipe(clean());
});

gulp.task('test', ['compile-typescript'], function () {
  return gulp.src(['dist/test/*.js'], { read: false })
      .pipe(mocha({ reporter: 'list' }))
      .on('error', gutil.log);
});

gulp.task('package-distribution-development', [], function (done) {
  runSequence('clean', 'config-development', 'compile', 'package-distribution', 'compile-sourcemaps', done);
});
gulp.task('package-distribution-acceptance', [], function (done) {
  runSequence('clean', 'config-acceptance', 'compile', 'package-distribution', 'compile-sourcemaps', done);
});
gulp.task('package-distribution-production', [], function (done) {
  runSequence('clean', 'config-production', 'compile', 'package-distribution', 'compile-sourcemaps', done);
});

gulp.task('package-distribution', [], function () {
  return gulp.src(['node_modules/**/*.d.ts', 'node_modules/**/*.js', 'node_modules/**/*.js.map', '!node_modules/**/node_modules', '!node_modules/**/node_modules/**']).pipe(gulp.dest("dist"));
});
