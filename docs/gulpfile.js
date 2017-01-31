var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var vulcanize = require('gulp-vulcanize');
var async = require('async');
var del = require('del');

gulp.task('default', ['prepublish'], function(cb){
  gulp.watch(['src/**/*.html'], _vulcanize);
  gulp.watch(['src/assets/**'], _copyAssets);
  gulp.watch(['src/docs/**'], _copyDocs);
  gulp.watch(['src/bower_components/marked/**'], function(cb, cb2){_copyBowerComponents('marked', cb, cb2);});
  gulp.watch(['src/bower_components/webcomponentsjs/**'],function(cb, cb2){ _copyBowerComponents('webcomponentsjs', cb, cb2);});
  gulp.watch(['src/bower_components/promise-polyfill/**'], function(cb, cb2){_copyBowerComponents('promise-polyfill', cb, cb2);});
  gulp.watch(['src/bower_components/web-animations-js/**'], function(cb, cb2){_copyBowerComponents('web-animations-js', cb, cb2);});

  gulpUtil.log(gulpUtil.colors.cyan('Watchers started'));
  cb();
});

gulp.task('clean', function(cb){
  _clean(cb);
});

gulp.task('prepublish', function (cb) {
  async.series([
    function (next) {
      _clean(next);
    },
    function (next) {
      async.parallel([
        function (cb) {
          _vulcanize(cb);
        },
        function(cb){
          _copyAssets(cb);
        },
        function(cb){
          _copyDocs(cb);
        },
        function (cb) {
          _copyBowerComponents('marked', cb);
        },
        function (cb) {
          _copyBowerComponents('webcomponentsjs', cb);
        },
        function (cb) {
          _copyBowerComponents('promise-polyfill', cb);
        },
        function (cb) {
          _copyBowerComponents('web-animations-js', cb);
        }
      ], function(err, results){
        if(err) {
          gulpUtil.log(err);
        }
        cb();
      });
    }
  ], function(err, results){
    if(err) {
      gulpUtil.log(err);
    }
    cb();
  });
});

function _clean(cb) {
  del.sync(['index.html', 'bower_components', 'assets']);
  cb();
}

function _vulcanize(cb, cb2) {
  if(typeof(cb) !== 'function' && typeof(cb) === 'function'){
    cb = cb2;
  }
  gulpUtil.log('Vulcanize src/index.html');
  gulp.src('src/index.html')
      .pipe(vulcanize({
        abspath: '',
        excludes: [],
        stripExcludes: false
      }))
      .pipe(gulp.dest('./'))
      .on('finish', function () {
        gulpUtil.log('Vulcanize src/index.html ', gulpUtil.colors.blue('done'));
        if(cb && typeof(cb) === 'function'){
          cb();
        }
      });
}

function _copyBowerComponents(name, cb, cb2) {
  if(typeof(cb) !== 'function' && typeof(cb) === 'function'){
    cb = cb2;
  }
  gulpUtil.log('Copy src/bower_components/' + name);
  gulp.src(['src/bower_components/' + name + '/**'])
      .pipe(gulp.dest('bower_components/' + name))
      .on('finish', function () {
        gulpUtil.log('Copy src/bower_components/' + name + ' ', gulpUtil.colors.blue('done'));
        if(cb && typeof(cb) === 'function'){
          cb();
        }
      });
}

function _copyAssets(cb, cb2) {
  if(typeof(cb) !== 'function' && typeof(cb) === 'function'){
    cb = cb2;
  }
  gulpUtil.log('Copy src/assets');
  gulp.src(['src/assets/**'])
      .pipe(gulp.dest('assets'))
      .on('finish', function () {
        gulpUtil.log('Copy src/assets ', gulpUtil.colors.blue('done'));
        if(cb && typeof(cb) === 'function'){
          cb();
        }
      });
}

function _copyDocs(cb, cb2) {
  if(typeof(cb) !== 'function' && typeof(cb) === 'function'){
    cb = cb2;
  }
  gulpUtil.log('Copy src/docs');
  gulp.src(['src/docs/**'])
      .pipe(gulp.dest('docs'))
      .on('finish', function () {
        gulpUtil.log('Copy src/docs ', gulpUtil.colors.blue('done'));
        if(cb && typeof(cb) === 'function'){
          cb();
        }
      });
}