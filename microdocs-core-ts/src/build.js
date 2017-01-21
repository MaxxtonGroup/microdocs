'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlExtender = require('gulp-html-extend');
var rimraf = require('gulp-rimraf');
var typescript = require('gulp-typescript');
var async = require('async');
var merge = require('merge2');
var replace = require('gulp-replace');
var fs = require('fs');
var Gaze = require('gaze').Gaze;
var mocha = require('gulp-mocha');

var settings;

function Builder(_settings) {
  settings = _settings;

  /**
   * Cleans, moves, and compiles the code
   */
  this.prepublish = function(cb) {
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

  this.watch = function(cb) {
    gutil.log('Starting ', gutil.colors.cyan('_watch'));
    _watchTypescript();
    gulp.watch(['package.json', 'LICENSE', 'README.md', 'src/build.js'], _deployMisc);
    gulp.watch(['src/**/*.spec.ts'], _compileSpecs);
    gutil.log(gutil.colors.cyan('Watchers started'));
    cb();
  };

  this.test = function(cb) {
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
        _runMocha(next);
      }
    ], cb);
  };


}

  function _clean(cb) {
    gulp.src(settings.distFolder, {read: false})
        .pipe(rimraf())
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

  function _compileTypescript(cb) {
    _compileTypescriptFromSrc(['src/**/*.ts', '!src/**/*spec.ts', '!src/config/**/*.ts'], cb);
  }

  function _watchTypescript() {
    gutil.log('Watching', gutil.colors.cyan('Typescript'));
    var gaze = new Gaze(['src/**/*.ts', 'src/**/*.html', '!src/**/*spec.ts']);
    gaze.on('all', function (event, filepath) {
      _compileChangedTypescript(event, filepath);
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

  function _compileTypescriptFromSrc(srcArray, cb) {
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
      tsResult.dts.pipe(gulp.dest(settings.distFolder)),
      tsResult.js.pipe(gulp.dest(settings.distFolder))
    ]).on('finish', function () {
      gutil.log('Finished ', gutil.colors.cyan('_compileTypescriptFromSrc'));
      if(cb) {
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
      author: json.author,
      license: json.license,
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
        .on('finish', function () {
          cb();
        });
  }


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

  function _runMocha(cb) {
    return gulp.src(['dist/**/*.spec.js'], {read: false})
        .pipe(mocha({reporter: 'list'}))
        .on('error', gutil.log);
  }

  function _compileChangedTypescript(vinyl) {
    var src = vinyl.history.toString();
    var event = vinyl.event.toString();
    if (event == 'change') {
      src = src.substring(src.lastIndexOf("/"));
      src = src.substring(src.lastIndexOf("\\"));
      src = src.replace("html", "ts");
      _compileTypescriptFromSrc(["src/**" + src], function () {
      }, true);
    }
    else if (event == 'add') {
      _compileTypescript(function () {
      });
    }
    else if (event == 'unlink') {
      var jsDistFileLoc = src.replace("\\src\\", '\\' + settings.distFolder + '\\').replace('.ts', '.js');
      var dTsDistFileLoc = src.replace("\\src\\", '\\' + settings.distFolder + '\\').replace('.ts', '.d.ts');
      gutil.log("Deleting", gutil.colors.magenta(jsDistFileLoc));
      return gulp.src([jsDistFileLoc, dTsDistFileLoc], {read: false})
          .pipe(rimraf());
    }
  }

function _compileSpecs(cb) {
    if(typeof(cb) !== 'function'){
      _compileTypescriptFromSrc(['src/**/*.spec.ts']);
    }else{
      _compileTypescriptFromSrc(['src/**/*.spec.ts'], cb);
    }
}

function  _deployMisc(cb) {
  gutil.log('Starting ', gutil.colors.cyan('_deployMisc'));

  gulp.src(['package.json', 'LICENSE', 'README.md', 'src/build.js'])
      .pipe(htmlExtender({annotations: false, verbose: false}))
      .pipe(gulp.dest(settings.distFolder))
      .on('finish', function () {
        gutil.log('Finished ', gutil.colors.cyan('_deployMisc'));
        cb();
      });

}

module.exports.Builder = Builder;