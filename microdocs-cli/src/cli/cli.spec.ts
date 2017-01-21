
import { expect, assert } from 'chai';
import { exec } from "shelljs";

describe( '#cli: ', () => {

  it('No sub command', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js';

   exec( cmd, (error: Error, stdout: string, stderr: string) => {
     checkAsync( done, function() {
        assert.equal(error, 1);
      } );
    } );
  });

  it('Unknown sub command', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js thisCommandDoesntExists';

    exec( cmd, (error: Error, stdout: string, stderr: string) => {
      checkAsync( done, function() {
        assert.equal(error, 1);
      } );
    } );
  });

  it('help command', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js help';

    exec( cmd, (error: Error, stdout: string, stderr: string) => {
      checkAsync( done, function() {
        assert.equal(error, 0);
      } );
    } );
  });

  it('version command', (done:(e?:any)=>void) => {
    var cmd = 'node ./dist/cli/cli.js --version';

    exec( cmd, (error: Error, stdout: string, stderr: string) => {
      checkAsync( done, function() {
        assert.equal(error, 0);
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