import { ProblemResponse, Problem } from "@maxxton/microdocs-core/domain";
import { CheckOptions } from "../options/check.options";
import { Logger } from "../helpers/logging/logger";
import { formatProblemMessage } from "../helpers/cli.helper";
const Client = require( 'node-rest-client' ).Client;

/**
 * @author Steven Hermans
 */
export class BitBucketClient {

  constructor( private logger: Logger ) {
  }

  private createClient( checkOptions: CheckOptions, errorHandler: ( error: any ) => void ): any {
    let authOption: any = undefined;
    if ( checkOptions.bitBucketUsername && checkOptions.bitBucketUsername !== '' && checkOptions.bitBucketPassword ) {
      authOption = { user: checkOptions.bitBucketUsername, password: checkOptions.bitBucketPassword };
    }
    let client = new Client( authOption );
    client.on( 'error', errorHandler );
    return client;
  }

  /**
   * Comment problem response to BitBucket Server
   * @param checkOptions
   * @param problemResponse
   * @returns {Promise<ProblemResponse>}
   */
  public publishToBitBucket( checkOptions: CheckOptions, problemResponse: ProblemResponse ): Promise<ProblemResponse> {
    return new Promise( ( resolve: ( problemResponse: ProblemResponse ) => void, reject: ( err?: any ) => void ) => {
      let client: any = this.createClient( checkOptions, reject );
      let details     = this.getPullRequestDetails( checkOptions.bitBucketPullRequestUrl );
      if ( problemResponse.problems ) {
        let promissen:Promise<number>[] = [];
        let problemsMap: { [file: string]: { [line: number]: Problem[] } } = {};
        problemResponse.problems.forEach(problem => {
          if(problem.path){
            if(!problemsMap[problem.path]){
              problemsMap[problem.path] = {};
            }
            let fileMap = problemsMap[problem.path];
            let line = problem.lineNumber || 0;
            if(fileMap[line]){
              fileMap[line] = [];
            }
            fileMap[line].push(problem);
          }else{
            promissen.push(this.postPullRequestComment(client, details, formatProblemMessage(problem)));
          }
        });
        for(let file in problemsMap){
          for(let line in problemsMap[file]){
            let problemList = problemsMap[file][line];
            let comment = problemList.map(problem => {
              let msg = formatProblemMessage(problem);
              if(problem.client){
                msg = '**Breaking change detected with [' + problem.client.title + '](' + problem.client.sourceLink + "):** " + msg;
              }
              return msg;
            }).join('\n');
            let promise = this.postPullRequestComment(client, details, comment, file, line);
            promissen.push(new Promise((resolve:()=>void,reject:(err?:any) => void) => {
              promise.then((commentId:number) => {
                Promise.all(problemList.map(problem => {
                  return this.postTask(client, details, problem.message, commentId);
                })).then(resolve, reject);
              }, reject);
            }));
          }
        }
        Promise.all(promissen).then(() => {
          resolve(problemResponse);
        }, reject);
      } else {
        resolve( problemResponse );
      }
    } );
  }

  /**
   * Get pull request details from the url
   * @param bitBucketPullRequestUrl
   * @returns {PullRequestDetails}
   */
  private getPullRequestDetails( bitBucketPullRequestUrl?: string ): PullRequestDetails {
    let regex = /^(?:(http[s]?|ftp):\/)?\/?([^:\/\s]+)(?:.+?)(?:projects\/(.*?)\/repos\/(.*?)\/pull-requests\/(.+?))$/;
    let match = bitBucketPullRequestUrl.match( regex );
    if ( match ) {
      return <PullRequestDetails> {
        original: bitBucketPullRequestUrl,
        url: match[ 1 ] + '://' + match[ 2 ],
        group: match[ 3 ],
        project: match[ 4 ],
        pullRequestId: match[ 5 ]
      };
    }
    return null;
  }

  /**
   * Post comment in fil eon pull request in stash
   * @param details
   * @param message
   * @param filePath
   * @param lineNumber
   * @return comment id
   */
  private postPullRequestComment( client: any, details: PullRequestDetails, message: string, filePath?: string, lineNumber?: number ): Promise<number> {
    return new Promise( ( resolve: ( commentId:number ) => void, reject: ( err?: any ) => void ) => {
      try {

        let comment: any = {
          text: message
        };
        if ( filePath ) {
          comment.anchor = {
            path: filePath.replace( /\\\\/g, '/' ),
            sourcePath: filePath.replace( /\\\\/g, '/' )
          };
          if ( lineNumber && lineNumber > 0 ) {
            comment.anchor.line     = lineNumber;
            comment.anchor.lineType = 'CONTEXT';
          }
        }
        let url     = `${details.url}/rest/api/1.0/projects/${details.group}/repo/${details.project}/pull-requests/${details.pullRequestId}/comments`;
        let options = {
          headers: { 'content-type': 'application/json' },
          data: JSON.stringify( comment )
        };
        this.logger.info( `post ${url} body(appliction/json) ${options.data}` );

        client.post( url, options, ( data: any, response: any ) => {
          if ( response.statusCode == 201 ) {
            resolve( data.id );
          } else {
            let message = "Wrong response status " + response.statusCode + ", expected 201 -> body:\n " + data.toString();
            reject( message );
          }
        } ).on( 'error', ( error: any ) => {
          let message = "Failed to POST to " + url + " (" + error + ")";
          reject( message );
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Post task on a existing comment
   * @param message task message
   * @param commentId comment id
   * @return task id
   */
  private postTask( client: any, details: PullRequestDetails, message: string, commentId: number ): Promise<number> {
    return new Promise( ( resolve: ( taskId: number ) => void, reject: ( err?: any ) => void ) => {
      try {
        let comment: any = {
          text: message,
          state: 'OPEN',
          anchor: {
            type: 'COMMENT',
            id: commentId
          }
        };
        let url          = `${details.url}/rest/api/1.0/tasks`;
        let options      = {
          headers: { 'content-type': 'application/json' },
          data: JSON.stringify( comment )
        };
        this.logger.info( `post ${url} body(appliction/json) ${options.data}` );

        client.post( url, options, ( data: any, response: any ) => {
          if ( response.statusCode == 201 ) {
            resolve( data.id );
          } else {
            let message = "Wrong response status " + response.statusCode + ", expected 201 -> body:\n " + data.toString();
            reject( message );
          }
        } ).on( 'error', ( error: any ) => {
          let message = "Failed to POST to " + url + " (" + error + ")";
          reject( message );
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

}

export interface PullRequestDetails {
  original?: string;
  url?: string;
  group?: string;
  project?: string;
  pullRequestId?: string;
}