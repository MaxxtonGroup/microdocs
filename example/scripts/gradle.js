#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var exec = require("child_process").exec;

var isWin = /^win/.test(process.platform);

if (process.argv.length >= 3) {
  var cwd = path.join(process.cwd(), process.argv[2]);
  var cmd;
  if (isWin) {
    cmd = 'cmd /c gradle.bat';
  } else {
    cmd = './gradle';
  }
  if(process.argv.length >= 4) {
    cmd += ' ' + process.argv.splice(3).join(' ');
  }
  var execOptions = {
    cwd: cwd
  };
  console.info('exec: ' + cmd);
  var childProcess = exec(cmd, execOptions, function(error, stdout, stderr){
    // console.log( stdout );
    // console.error( stderr );
    if ( !error ) {
      console.info('exit(0)');
      process.exit(0);
    }else{
      console.error( error.message );
      console.info('exit(1)');
      process.exit(1);
    }
  });
  childProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });
} else {
  console.error('Usage: node gradle.js <folder> <gradleTask>');
}