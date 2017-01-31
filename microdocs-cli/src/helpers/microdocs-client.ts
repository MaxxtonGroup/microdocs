import { ServerOptions } from "../options/server.options";
import { Project, ProblemResponse } from "@maxxton/microdocs-core/domain";
import { CheckOptions } from "../options/check.options";
import { PublishOptions } from "../options/publish.options";
import { ClusterOptions } from "../options/cluster.options";
const Client = require( 'node-rest-client' ).Client;

/**
 * @author Steven Hermans
 */
export class MicroDocsClient {

  private createClient( serverOptions: ServerOptions, errorHandler: ( error: any ) => void ): any {
    var authOption: any = undefined;
    if ( serverOptions.username && serverOptions.username !== '' && serverOptions.password ) {
      authOption = { user: serverOptions.username, password: serverOptions.password };
    }
    var client = new Client( authOption );
    client.on( 'error', errorHandler );
    return client;
  }

  /**
   * GET /
   * @param serverOptions
   * @return {Promise<boolean>}
   */
  public login( serverOptions: ServerOptions ): Promise<boolean> {
    return new Promise( ( resolve: ( loggedIn: boolean ) => void, reject: ( err?: any ) => void ) => {
      let client: any = this.createClient( serverOptions, reject );
      client.get( serverOptions.url, ( data: ProblemResponse, response: any ) => {
        if ( response.statusCode == 200 ) {
          resolve( true );
        } else if ( response.statusCode == 401 ) {
          reject( new Error( 'Login failed: unautorized' ) );
        } else {
          reject( new Error( 'Login failed: server responed with status ' + response.statusCode ) );
        }
      } ).on( 'error', reject );
    } );
  }

  /**
   * POST /api/v1/check
   * @param checkOptions
   * @param project
   * @return {Promise<ProblemResponse>}
   */
  public check( checkOptions: CheckOptions, project: Project ): Promise<ProblemResponse> {
    return new Promise( ( resolve: ( result: ProblemResponse ) => void, reject: ( err?: any ) => void ) => {
      try {
        var errorHandler = ( error: any ) => {
          var message = "Failed to POST to " + url + " (" + error + ")";
          resolve( { message: message, status: 'failed' } );
        };

        var client: any = this.createClient( checkOptions, errorHandler );

        var params = {};
        if ( checkOptions.title ) {
          params[ 'title' ] = checkOptions.title;
        }
        if ( checkOptions.env ) {
          params[ 'env' ] = checkOptions.env;
        }
        var options = {
          parameters: params,
          headers: { 'content-type': 'application/json' },
          data: JSON.stringify( project )
        };
        var url     = checkOptions.url + '/api/v1/check';
        console.info( "POST " + url );

        client.post( url, options, ( data: ProblemResponse, response: any ) => {
          if ( response.statusCode == 200 ) {
            resolve( data );
          } else {
            var message = "Wrong response status " + response.statusCode + ", expected 200 -> body:\n " + data.toString();
            resolve( { message: message, status: 'failed' } );
          }
        } ).on( 'error', errorHandler );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * PUT /api/v1/projects/{title}
   * @param publishOptions
   * @param project
   * @param callback
   */
  public publish( publishOptions: PublishOptions, project: Project, callback: ( response: (ProblemResponse|string) ) => void ) {
    var errorHandler = ( error: any ) => {
      var message = "Failed to PUT to " + url + " (" + error + ")";
      callback( { message: message, status: 'failed' } );
    };

    var client: any = this.createClient( publishOptions, errorHandler );

    var params = {};
    if ( publishOptions.version ) {
      params[ 'version' ] = publishOptions.version;
    }
    if ( publishOptions.group ) {
      params[ 'group' ] = publishOptions.group;
    }
    if ( publishOptions.env ) {
      params[ 'env' ] = publishOptions.env;
    }
    if ( publishOptions.force ) {
      params[ 'failOnProblems' ] = false;
    }
    var options = {
      parameters: params,
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify( project )
    };
    var url     = publishOptions.url + '/api/v1/projects/' + encodeURIComponent( publishOptions.title );
    console.info( "PUT " + url );

    client.put( url, options, ( data: ProblemResponse, response: any ) => {
      if ( response.statusCode == 200 ) {
        callback( data );
      } else {
        var message = "Wrong response status " + response.statusCode + ", expected 200 -> body:\n " + data.toString();
        callback( { message: message, status: 'failed' } );
      }
    } ).on( 'error', errorHandler );
  }

  public getProjects( clusterOptions: ClusterOptions, exportType: string, callback: ( response: ProblemResponse ) => void ) {
    var errorHandler = ( error: any ) => {
      var message = "Failed to GET to " + url + " (" + error + ")";
      callback( { message: message, status: 'failed' } );
    };

    var client: any = this.createClient( clusterOptions, errorHandler );

    var params = { export: exportType };
    if ( clusterOptions.env ) {
      params[ 'env' ] = clusterOptions.env;
    }
    if ( clusterOptions.filterProjects ) {
      params[ 'projects' ] = clusterOptions.filterProjects;
    }
    if ( clusterOptions.filterGroups ) {
      params[ 'groups' ] = clusterOptions.filterGroups;
    }
    var options = {
      parameters: params,
      headers: { 'content-type': 'application/json' },
    };
    var url     = clusterOptions.url + '/api/v1/projects';
    if ( clusterOptions.targetProject ) {
      url += '/' + clusterOptions.targetProject;
      if ( clusterOptions.targetVersion ) {
        params[ 'version' ] = clusterOptions.targetVersion;
      }
      if ( clusterOptions.build ) {
        params[ 'build-self' ] = true;
      }
    }
    console.info( "GET " + url );

    client.get( url, options, ( data: string, response: any ) => {
      if ( response.statusCode == 200 ) {
        callback( data.toString() );
      } else {
        var message = "Wrong response status " + response.statusCode + ", expected 200 -> body:\n " + data.toString();
        callback( { message: message, status: 'failed' } );
      }
    } ).on( 'error', errorHandler );
  }

}