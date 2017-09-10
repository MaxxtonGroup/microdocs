import { Service } from "typedi";
import { Environment } from "../domain/environment.model";
import { ProjectTree } from "@maxxton/microdocs-core/domain";
import { LoggerFactory } from "@webscale/logging";
import * as workerFarm from "worker-farm";

const loggger = LoggerFactory.create();

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
   * @return {Promise<void>}
   */
  public startIndexing( env: Environment, projectTitle?: string, documentId?: string ): Promise<ProjectTree> {
    if ( !this.workers[ env.name ] ) {
      loggger.info("Create worker ");
      this.workers[ env.name ] = this.createWorker();
    }
    let worker = this.workers[ env.name ];
    return new Promise<ProjectTree>( ( resolve, reject ) => {
      try {
        loggger.info("Start worker: " + env.name);
        worker( env, projectTitle, documentId, ( err: any, result: ProjectTree ) => {
          if ( err ) {
            loggger.warn("Failed worker: " + env.name);
            reject( err );
          } else {
            loggger.info("Finish worker: " + env.name);
            resolve(result);
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
  ( env: Environment, projectTitle: string, documentId: string, callback: WorkerCallback ): void;
}