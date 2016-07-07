'use strict';

var gulp = require('gulp');
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
var SystemBuilder = require('systemjs-builder');
var plumber = require('gulp-plumber');
var fs = require("fs");
const tscConfig = require('./src/tsconfig.json');

var settings = {
  env: 'development',
  distFolder: 'dist'
};

var builder = new SystemBuilder({
  "baseURL": 'dist',
});

var tsProjectConf = typescript.createProject('./src/tsconfig.json');

gulp.task('default', function (done) {
  runSequence('clean', 'compile', 'config-development', 'compile-sourcemaps', 'run', 'watch', done);
});

gulp.task('compile', ['compile-sass', 'compile-typescript', 'compile-assets', 'compile-html']);

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


gulp.task('bundle-libs', [], function () {
  return builder.loadConfig('./src/systemjs.config.js')
      .then(function () {
        return builder.bundle(
            'app - [app/**/*] - [angular-frontend-mxt/**/*]', // build app and remove the app code - this leaves only 3rd party dependencies
            'dist/libs-bundle.js',
            {minify: true, sourceMaps: true}
        );
      })
      .then(function () {
        console.log('library bundles built successfully!');
      });
});

gulp.task('compile-sass', [], function () {
  return gulp.src('src/assets/scss/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('compile-assets', [], function () {
  gulp.src('src/assets/fonts/**/**').pipe(gulp.dest('dist/assets/fonts'));
  gulp.src('src/assets/i18n/**/**').pipe(gulp.dest('dist/assets/i18n'));
  return gulp.src('src/assets/images/**/**').pipe(gulp.dest('dist/assets/images'));
});
gulp.task('compile-html', [], function () {

  return fs.readFile("src/config/config-" + settings.env + ".ts", {
    encoding: 'utf-8',
    flag: 'rs'
  }, function (e, data) {
    var basePath = data.toString().match("basepath.+=.+\"(.+)\";");
    return gulp.src('src/index.html')
        .pipe(replace('<base mxt/>', '<base href="' + basePath[1] + '"></base>'))
        .pipe(gulp.dest(settings.distFolder));
  });


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
  gulp.watch(['src/**/*.ts', 'src/**/*.html'], ['compile-typescript']);
  gulp.watch('src/assets/scss/**/*.scss', ['compile-sass']);
  gulp.watch(['src/assets/fonts/**/**', 'src/assets/images/**/**'], ['compile-assets']);
  gulp.watch('src/index.html', ['compile-html']);
});

gulp.task('run', [], function () {
  liveserver.server({
    root: [settings.distFolder, 'node_modules'],
    port: 8000,
    livereload: true,
    fallback: settings.distFolder + '/index.html'
  });

  gulp.watch('dist/**/**', function (file) {
    liveserver.reload();
  });
});

gulp.task('clean', [], function () {
  return gulp.src(settings.distFolder, {read: false}).pipe(clean());
});

gulp.task('test', [], function () {

});

gulp.task('package-distribution-development', [], function (done) {
  runSequence('clean', 'config-development', 'compile', 'package-distribution', 'compile-sourcemaps', 'bundle-libs', done);
});
gulp.task('package-distribution-acceptance', [], function (done) {
  runSequence('clean', 'config-acceptance', 'compile', 'package-distribution', 'compile-sourcemaps', 'bundle-libs', done);
});
gulp.task('package-distribution-production', [], function (done) {
  runSequence('clean', 'config-production', 'compile', 'package-distribution', 'compile-sourcemaps', 'bundle-libs', done);
});

gulp.task('package-distribution', [], function () {
  return gulp.src(['node_modules/**/*.d.ts', 'node_modules/**/*.js', 'node_modules/**/*.js.map', '!node_modules/**/node_modules', '!node_modules/**/node_modules/**']).pipe(gulp.dest("dist"));
});
