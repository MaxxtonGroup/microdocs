import { ServerOptions } from "../options/server.options";
import { Project, ProblemResponse } from "@maxxton/microdocs-core/domain";
import { CheckOptions } from "../options/check.options";
import { PublishOptions } from "../options/publish.options";
import { ClusterOptions } from "../options/cluster.options";
import { Logger } from "../helpers/logging/logger";
const Client = require( 'node-rest-client' ).Client;

/**
 * @author Steven Hermans
 */
export class MicroDocsClient {

  constructor( private logger: Logger ) {
  }

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
      this.logger.info('GET ' + serverOptions.url);
      client.get( serverOptions.url, ( data: ProblemResponse, response: any ) => {
        this.logger.debug('Response: ' + response.statusCode);
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
          var message = "Failed to post to " + url + " (" + error + ")";
          resolve( { message: message, status: 'failed' } );
        };

        var client: any = this.createClient( checkOptions, errorHandler );

        var params: any = {};
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
        this.logger.info('post ' + url);

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
  public publish( publishOptions: PublishOptions, project: Project ): Promise<ProblemResponse> {
    return new Promise( ( resolve: ( result: ProblemResponse ) => void, reject: ( err?: any ) => void ) => {
      try {
        var errorHandler = ( error: any ) => {
          var message = "Failed to PUT to " + url + " (" + error + ")";
          resolve( { message: message, status: 'failed' } );
        };

        var client: any = this.createClient( publishOptions, errorHandler );

        var params: any = {};
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
        this.logger.info('PUT ' + url);

        client.put( url, options, ( data: ProblemResponse, response: any ) => {
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

  public getProjects( clusterOptions: ClusterOptions, exportType: string, callback: ( response: ProblemResponse ) => void ) {
    var errorHandler = ( error: any ) => {
      var message = "Failed to get to " + url + " (" + error + ")";
      callback( { message: message, status: 'failed' } );
    };

    var client: any = this.createClient( clusterOptions, errorHandler );

    var params: any = { export: exportType };
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
    this.logger.info('get ' + url);

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