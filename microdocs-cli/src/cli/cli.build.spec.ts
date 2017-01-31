import { expect, assert } from 'chai';
import { exec, ExecOptions } from "child_process";
import * as path from 'path';
import * as fs from 'fs';
import { Project } from "@maxxton/microdocs-core/domain";
const globby = require( 'globby' );

describe( '#cli.build: ', () => {

  const TEST_DIR: string = path.join( __dirname, '../test/cli.build' );

  before( () => {
    cleanUpBuild();
  } );

  after( () => {
    cleanUpBuild();
  } );

  it( 'Default options', ( done: ( e?: any ) => void ) => {
    let workingDir           = path.join( TEST_DIR, 'default_options' );
    let definitionFile       = path.join( workingDir, 'microdocs.json' );
    let cmd                  = 'node "' + path.join( __dirname, 'cli.js' ) + '" build';
    let options: ExecOptions = {
      cwd: workingDir
    };

    exec( cmd, options, ( error: Error, stdout: string, stderr: string ) => {
      checkAsync( done, function () {
        assert.isNull( error );
        assert.equal( 'No tsConfig found in \'tsconfig.json\', use default compile options\n', stderr );
        assert.isTrue( fs.existsSync( definitionFile ) );
        let json             = fs.readFileSync( definitionFile );
        let project: Project = JSON.parse( json.toString() );
        assert.equal( project.info.title, 'default_options' );
      } );
    } );
  } ).timeout( 5000 );

  it( 'Custom options', ( done: ( e?: any ) => void ) => {
    let workingDir     = path.join( TEST_DIR, 'custom_options' );
    let definitionFile = path.join( workingDir, 'microdocs.json' );
    let cmd            = 'node "' + path.join( __dirname, 'cli.js' ) + '" build';
    cmd += ' --source "' + workingDir + '"';
    cmd += ' --patterns "test.client.ts"';
    cmd += ' --definitionFile "' + definitionFile + '"';

    exec( cmd, ( error: Error, stdout: string, stderr: string ) => {
      checkAsync( done, function () {
        assert.isNull( error );
        assert.equal( 'No tsConfig found in \'tsconfig.json\', use default compile options\n', stderr );
        assert.isTrue( fs.existsSync( definitionFile ) );
        let json             = fs.readFileSync( definitionFile );
        let project: Project = JSON.parse( json.toString() );
        assert.equal( project.info.title, 'custom_options' );
      } );
    } );
  } ).timeout( 5000 );

  it( 'Cache definitions', ( done: ( e?: any ) => void ) => {
    let workingDir     = path.join( TEST_DIR, 'cache_definition' );
    let definitionFile = path.join( workingDir, 'microdocs.json' );
    let cmd            = 'node "' + path.join( __dirname, 'cli.js' ) + '" build';
    cmd += ' --source "' + workingDir + '"';
    cmd += ' --patterns "test.client.ts"';
    cmd += ' --definitionFile "' + definitionFile + '"';

    exec( cmd, ( error: Error, stdout: string, stderr: string ) => {
      try {
        assert.isNull( error );
        assert.equal( 'No tsConfig found in \'tsconfig.json\', use default compile options\n', stderr );
        assert.isTrue( fs.existsSync( definitionFile ) );
        let json             = fs.readFileSync( definitionFile );
        let project: Project = JSON.parse( json.toString() );
        assert.equal( project.info.title, 'cache_definition' );
        project[ 'changed' ] = true;
        fs.writeFileSync( definitionFile, JSON.stringify( project ) );

        exec( cmd, ( error: Error, stdout: string, stderr: string ) => {
          checkAsync( done, function () {
            assert.isNull( error );
            assert.equal( '', stderr );
            assert.isTrue( fs.existsSync( definitionFile ) );
            let json             = fs.readFileSync( definitionFile );
            let project: Project = JSON.parse( json.toString() );
            assert.equal( project.info.title, 'cache_definition' );
            assert.isTrue( project[ 'changed' ] );
          } );
        } );
      } catch ( e ) {
        done( e );
      }
    } );
  } ).timeout( 10000 );

  it( 'Ignore cache definitions', ( done: ( e?: any ) => void ) => {
    let workingDir     = path.join( TEST_DIR, 'ignore_cache_definition' );
    let definitionFile = path.join( workingDir, 'microdocs.json' );
    let cmd            = 'node "' + path.join( __dirname, 'cli.js' ) + '" build';
    cmd += ' --source "' + workingDir + '"';
    cmd += ' --patterns "test.client.ts"';
    cmd += ' --definitionFile "' + definitionFile + '"';
    cmd += ' --no-cache';

    exec( cmd, ( error: Error, stdout: string, stderr: string ) => {
      try {
        assert.isNull( error );
        assert.equal( 'No tsConfig found in \'tsconfig.json\', use default compile options\n', stderr );
        assert.isTrue( fs.existsSync( definitionFile ) );
        let json             = fs.readFileSync( definitionFile );
        let project: Project = JSON.parse( json.toString() );
        assert.equal( project.info.title, 'ignore_cache_definition' );
        project[ 'changed' ] = true;
        fs.writeFileSync( definitionFile, JSON.stringify( project ) );

        exec( cmd, ( error: Error, stdout: string, stderr: string ) => {
          checkAsync( done, function () {
            assert.isNull( error );
            assert.equal( 'No tsConfig found in \'tsconfig.json\', use default compile options\n', stderr );
            assert.isTrue( fs.existsSync( definitionFile ) );
            let json             = fs.readFileSync( definitionFile );
            let project: Project = JSON.parse( json.toString() );
            assert.equal( project.info.title, 'ignore_cache_definition' );
            assert.isUndefined( project[ 'changed' ] );
          } );
        } );
      } catch ( e ) {
        done( e );
      }
    } );
  } ).timeout( 10000 );

  it( 'Changed cache definitions', ( done: ( e?: any ) => void ) => {
    let workingDir     = path.join( TEST_DIR, 'changed_cache_definition' );
    let definitionFile = path.join( workingDir, 'microdocs.json' );
    let cmd            = 'node "' + path.join( __dirname, 'cli.js' ) + '" build';
    cmd += ' --source "' + workingDir + '"';
    cmd += ' --patterns "test.client.ts"';
    cmd += ' --definitionFile "' + definitionFile + '"';

    exec( cmd, ( error: Error, stdout: string, stderr: string ) => {
      try {
        assert.isNull( error );
        assert.equal( 'No tsConfig found in \'tsconfig.json\', use default compile options\n', stderr );
        assert.isTrue( fs.existsSync( definitionFile ) );
        let json             = fs.readFileSync( definitionFile );
        let project: Project = JSON.parse( json.toString() );
        assert.equal( project.info.title, 'changed_cache_definition' );
        project[ 'changed' ] = true;
        fs.writeFileSync( definitionFile, JSON.stringify( project ) );

        let cmd = 'node "' + path.join( __dirname, 'cli.js' ) + '" build';
        cmd += ' --source "' + workingDir + '"';
        cmd += ' --patterns "test.client2.ts"';
        cmd += ' --definitionFile "' + definitionFile + '"';
        exec( cmd, ( error: Error, stdout: string, stderr: string ) => {
          checkAsync( done, function () {
            assert.isNull( error );
            assert.equal( 'No tsConfig found in \'tsconfig.json\', use default compile options\n', stderr );
            assert.isTrue( fs.existsSync( definitionFile ) );
            let json             = fs.readFileSync( definitionFile );
            let project: Project = JSON.parse( json.toString() );
            assert.equal( project.info.title, 'changed_cache_definition' );
            assert.isUndefined( project[ 'changed' ] );
          } );
        } );
      } catch ( e ) {
        done( e );
      }
    } );
  } ).timeout( 10000 );

  it( 'Ignore build definitions', ( done: ( e?: any ) => void ) => {
    let workingDir     = path.join( TEST_DIR, 'ignore_build_definition' );
    let definitionFile = path.join( workingDir, 'microdocs.json' );
    let cmd            = 'node "' + path.join( __dirname, 'cli.js' ) + '" build';
    cmd += ' --source "' + workingDir + '"';
    cmd += ' --patterns "test.client.ts"';
    cmd += ' --definitionFile "' + definitionFile + '"';
    cmd += ' --no-build';


    fs.writeFileSync( definitionFile, JSON.stringify( { changed: true } ) );

    exec( cmd, ( error: Error, stdout: string, stderr: string ) => {
      checkAsync( done, function () {
        assert.isNull( error );
        assert.equal( '', stderr );
        assert.isTrue( fs.existsSync( definitionFile ) );
        let json             = fs.readFileSync( definitionFile );
        let project: Project = JSON.parse( json.toString() );
        assert.isTrue( project[ 'changed' ] );
      } );
    } );
  } ).timeout( 10000 );

  function cleanUpBuild() {
    let exts: string[] = [ '.json', '.json.hash' ];
    let folders        = exts.map( ext => path.join( TEST_DIR, '/**/*' + ext ) );
    globby.sync( folders ).forEach( ( file: string ) => {
      fs.unlinkSync( file );
    } );
  }

} );

function checkAsync( done: ( e?: any ) => void, f: () => void ) {
  try {
    f();
    done();
  } catch ( e ) {
    done( e );
  }
}

declare function it( expectation: string, assertion?: ( done: DoneFn ) => void, timeout?: number ): { timeout: ( t: number ) => void };
declare function before( action: ( done: DoneFn ) => void, timeout?: number ): void;
declare function after( action: ( done: DoneFn ) => void, timeout?: number ): void;