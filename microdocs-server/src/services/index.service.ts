import { Service } from "typedi";
import { Environment } from "@maxxton/microdocs-core/domain";
import { ProblemReport, Project } from "@maxxton/microdocs-core/domain";
import { LoggerFactory } from "@webscale/logging";
import * as workerFarm from "worker-farm";
import { ProcessOptions } from "../domain/process-options.model";

const loggger = LoggerFactory.create();

const STRICT = true;

/**
 * Service for starting index tasks async
 */
@Service()
export class IndexService {

  private workers: { [env: string]: Worker } = {};

  /**
   *
   * @param moduleTask module which will do the indexing as a child process
   */
  constructor( private moduleTask: string = "../indexer/indexer" ) {
  }

  /**
   * Schedule a new indexing task
   * @param env environment which will be indexed
   * @param projectTitle only index a specific project (and its upstream dependencies)
   * @param documentId only index a specific report of a project (and its upstream dependencies)
   * @return {Promise<ProblemReport>}
   */
  public startIndexing( env: Environment, projectTitle?: string, documentId?: string ): Promise<ProblemReport> {
    if ( !this.workers[ env.name ] ) {
      this.workers[ env.name ] = this.createWorker();
    }
    let worker = this.workers[ env.name ];
    return new Promise<ProblemReport>( ( resolve, reject ) => {
      try {
        loggger.info( "[indexing] Start worker: " + env.name );

        let options: ProcessOptions = {
          strict: STRICT,
          env: env,
          projectTitle: projectTitle,
          documentId: documentId,
          dryRun: false,
          reverseChecking: false
        };

        worker( options, ( err: any, result: ProblemReport ) => {
          if ( err ) {
            loggger.warn( "[indexing] Failed worker: " + env.name );
            reject( err );
          } else {
            loggger.info( "[indexing] Finish worker: " + env.name );
            resolve( result );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Schedule a new checking task
   * @param env environment which will be indexed
   * @param document
   * @return {Promise<ProblemReport>}
   */
  public startChecking( env: Environment, document: Project ): Promise<ProblemReport> {
    if ( !this.workers[ env.name ] ) {
      this.workers[ env.name ] = this.createWorker();
    }
    let worker = this.workers[ env.name ];
    return new Promise<ProblemReport>( ( resolve, reject ) => {
      try {
        loggger.info( "[checking] Start worker: " + env.name );

        let options: ProcessOptions = {
          strict: STRICT,
          env: env,
          document: document,
          dryRun: true,
          reverseChecking: true
        };

        worker( options, ( err: any, result: ProblemReport ) => {
          if ( err ) {
            loggger.warn( "[checking] Failed worker: " + env.name );
            reject( err );
          } else {
            loggger.info( "[checking] Finish worker: " + env.name );
            resolve( result );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  private createWorker(): Worker {
    return workerFarm( {
      maxConcurrentWorkers: 1,
      maxConcurrentCallsPerWorker: 1,
      maxRetries: 10,
      autoStart: true
    }, require.resolve( this.moduleTask ) );
  }

}

interface Worker {
  ( processOptions: ProcessOptions, callback: WorkerCallback ): void;
}