'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlExtender = require('gulp-html-extend');
var typescript = require('gulp-typescript');
var async = require('async');
var merge = require('merge2');
var replace = require('gulp-replace');
var fs = require('fs');
var Gaze = require('gaze').Gaze;
var mocha = require('gulp-mocha');
var vinylPaths = require('vinyl-paths');
var del = require('del');

function Builder(settings) {

  settings = Object.assign({
    distFolder: 'dist',
    distResourceFolder: 'dist',
    distTestFolder: 'dist',
    distTestResourceFolder: 'dist/test',
    testPattern: 'dist/**/*.spec.js',
    tsConfig: {},
    src: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/test/**'],
    srcResources: ['package.json', 'LICENSE', 'README.md'],
    test: ['src/**/*.spec.ts'],
    testResources: ['src/test/**']
  }, settings);

  /**
   * Cleans, moves, and compiles the code
   */
  this.prepublish = function (cb) {
    async.series([
      function (next) {
        _clean(next);
      },
      function (next) {
        _build(next);
      },
      function (next) {
        _prepublishPackage(next);
      }
    ], cb);
  };

  function _clean(cb) {
    gulp.src(settings.distFolder + '/*', {read: false})
        .pipe(vinylPaths(del))
        .on('error', gutil.log)
        .on('finish', function () {
          cb();
        });
  }

  function _build(cb) {
    async.series([
      function (next) {
        _deployMisc(next);
      },
      function (next) {
        _compileTypescript(next);
      }
    ], cb);
  }

  function _deployMisc(cb) {
    gutil.log('Starting ', gutil.colors.cyan('_deployMisc'));

    gulp.src(settings.srcResources)
        .pipe(htmlExtender({annotations: false, verbose: false}))
        .pipe(gulp.dest(settings.distResourceFolder))
        .on('error', gutil.log)
        .on('finish', function () {
          gutil.log('Finished ', gutil.colors.cyan('_deployMisc'));
          if(typeof(cb) === 'function') {
            cb();
          }
        });

  }

  function _deployTestMisc(cb) {
    gutil.log('Starting ', gutil.colors.cyan('_deployTestMisc'));

    gulp.src(settings.testResources)
        .pipe(gulp.dest(settings.distTestResourceFolder))
        .on('error', gutil.log)
        .on('finish', function () {
          gutil.log('Finished ', gutil.colors.cyan('_deployTestMisc'));
          cb();
        });

  }

  function _compileTypescript(cb) {
    _compileTypescriptFromSrc(settings.src, false, cb);
  }

  this.watch = function (cb) {
    gutil.log('Starting ', gutil.colors.cyan('_watch'));
    _watchTypescript(false);
    gulp.watch(settings.srcResources, _deployMisc);
    gutil.log(gutil.colors.cyan('Watchers started'));
    cb();
  };

  this.watchTest = function (cb) {
    gutil.log('Starting ', gutil.colors.cyan('_watch'));
    _watchTypescript(false);
    gulp.watch(settings.srcResources, _deployMisc);
    gulp.watch(settings.test, _compileSpecs);
    gulp.watch(settings.testResources, _deployTestMisc);
    gutil.log(gutil.colors.cyan('Watchers started'));
    cb();
  };

  function _watchTypescript(isTest) {
    gutil.log('Watching', gutil.colors.cyan('Typescript'));
    var gaze = new Gaze(isTest ? settings.test : settings.src);
    gaze.on('all', function (event, filepath) {
      _compileChangedTypescript(event, isTest, filepath);
    });
    gaze.on('error', function (error) {
      gaze.close();
      gutil.log('error occured during', gutil.colors.cyan('typescript'), 'watch. Compiling and re-watching', gutil.colors.cyan('typescript'), 'in a few seconds...');
      setTimeout(function () {
        _compileTypescript(function () {
          _watchTypescript();
        });
      }, 3000);
    });
  }

  function _compileChangedTypescript(event, isTest, src) {
    if (event == 'changed') {
      src = src.substring(src.lastIndexOf("/"));
      src = src.substring(src.lastIndexOf("\\"));

      _compileTypescriptFromSrc(["src/**" + src], isTest, function () {
      }, true);
    }
    else if (event == 'added') {
      _compileTypescript(function () {
      });
    }
    else if (event == 'deleted') {
      var jsDistFileLoc = src.replace("\\src\\", '\\' + settings.distFolder + '\\').replace('.ts', '.js');
      var dTsDistFileLoc = src.replace("\\src\\", '\\' + settings.distFolder + '\\').replace('.ts', '.d.ts');
      gutil.log("Deleting", gutil.colors.magenta(jsDistFileLoc));
      return gulp.src([jsDistFileLoc, dTsDistFileLoc], {read: false})
          .pipe(rimraf());
    }
  }

  function _compileTypescriptFromSrc(srcArray, isTest, cb) {
    gutil.log("Starting", gutil.colors.cyan('_compileTypescriptFromSrc'), "for file(s)", gutil.colors.magenta(srcArray));

    var compilerOptions = Object.assign({}, settings.tsConfig.compilerOptions);

    //if we changed 1 file its not needed to compile the whole source code
    if (srcArray.length == 1 && srcArray[0].slice(-2) == "ts") {
      compilerOptions['isolatedModules'] = true;
    }

    var tsProject = typescript.createProject(compilerOptions);
    var tsResult = gulp.src(srcArray)
        .pipe(tsProject());
    merge([
      tsResult.dts.pipe(gulp.dest(isTest ? settings.distTestFolder : settings.distFolder)),
      tsResult.js.pipe(gulp.dest(isTest ? settings.distTestFolder : settings.distFolder))
    ]).on('finish', function () {
      gutil.log('Finished ', gutil.colors.cyan('_compileTypescriptFromSrc'));
      if (cb && typeof(cb) === 'function') {
        cb();
      }
    });
  }

  /**
   * Copy part of the package.json to the dist folder for publishing.
   */
  function _prepublishPackage(cb) {
    var json = JSON.parse(fs.readFileSync('./package.json'));
    var publishJson = {
      name: json.name,
      version: json.version,
      description: json.description,
      bin: json.bin,
      typings: json.typings,
      main: json.main,
      repository: json.repository,
      keywords: json.keywords,
      author: json.author,
      license: json.license,
      bugs: json.bugs,
      homepage: json.homepage,
      publishConfig: json.publishConfig,
      dependencies: json.dependencies
    };

    var src = require('stream').Readable({objectMode: true});
    src._read = function () {
      this.push(new gutil.File({
        cwd: "",
        base: "",
        path: "package.json",
        contents: new Buffer(JSON.stringify(publishJson, null, 2))
      }));
      this.push(null)
    };
    src.pipe(gulp.dest(settings.distFolder + '/'))
        .on('error', gutil.log)
        .on('finish', function () {
          gulp.src("./.npmrc")
              .pipe(gulp.dest(settings.distFolder))
              .on('error', gutil.log)
              .on('finish', function () {
                cb();
              });
        });
  }

  this.test = function (cb) {
    async.series([
      function (next) {
        _clean(next);
      },
      function (next) {
        _buildDeploy(next);
      },
      function (next) {
        _compileSpecs(next);
      },
      function (next) {
        _deployTestMisc(next);
      },
      function (next) {
        _runMocha(next);
      }
    ], cb);
  };

  function _buildDeploy(cb) {
    async.series([
      function (next) {
        _deployMisc(next);
      },
      function (next) {
        _compileTypescript(next);
      }
    ], cb);
  }

  function _compileSpecs(cb) {
    _compileTypescriptFromSrc(settings.test, true, cb);
  }

  function _runMocha(cb) {
    return gulp.src(settings.testPattern, {read: false})
        .pipe(mocha({reporter: 'list'}))
        .on('error', gutil.log);
  }

}

module.exports.Builder = Builder;