
import { expect, assert } from 'chai';
import { exec } from "child_process";

describe( '#cli: ', () => {

  it('No sub command', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js';

   exec( cmd, (error: Error, stdout: string, stderr: string) => {
     checkAsync( done, function() {
       assert.isNotNull(error);
      } );
    } );
  });

  it('Unknown sub command', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js thisCommandDoesntExists';

    exec( cmd, (error: Error, stdout: string, stderr: string) => {
      checkAsync( done, function() {
        assert.isNotNull(error);
      } );
    } );
  });

  it('help option', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js --help';

    exec( cmd, (error: Error, stdout: string, stderr: string) => {
      checkAsync( done, function() {
        assert.isNull(error);
      } );
    } );
  });

  it('help command', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js help';

    exec( cmd, (error: Error, stdout: string, stderr: string) => {
      checkAsync( done, function() {
        assert.isNull(error);
      } );
    } );
  });

  it('version command', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js --version';

    exec( cmd, (error: Error, stdout: string, stderr: string) => {
      checkAsync( done, function() {
        assert.isNull(error);
      } );
    } );
  });

});

function checkAsync( done:(e?:any)=>void, f:()=>void ) {
  try {
    f();
    done();
  } catch( e ) {
    done( e );
  }
}