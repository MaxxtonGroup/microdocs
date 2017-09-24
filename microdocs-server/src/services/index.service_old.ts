import { Service } from "typedi";
import { Environment } from "@maxxton/microdocs-core/domain";
import { LoggerFactory, Logger, LogLevel } from "@webscale/logging";
import { fork } from "child_process";
import { ProjectTree } from "@maxxton/microdocs-core/domain";

@Service()
export class IndexService {

  private runningTasks: IndexTask<Object>[] = [];
  private queuedTasks: IndexTask<Object>[]  = [];

  constructor( private moduleTask: string = "../indexer/index" ) {
  }

  /**
   * Start a new index task for a environment
   * @param {Environment} env
   * @param {string} projectTitle index only documents related to this project
   * @param {string} id of a report
   * @returns {Promise<ProjectTree>}
   */
  public startIndexing( env: Environment, projectTitle?: string, id?: string ): Promise<ProjectTree> {
    return new Promise( ( resolve, reject ) => {
      let task = new IndexTask<Object>( this.moduleTask, "reindex", env.name, env.name );
      this.queueTask( task );
      task.promise().then( object => {
        try {
          resolve( ProjectTree.link( object ) )
        } catch ( e ) {
          reject( e );
        }
      } ).catch( e => reject( e ) );
    } );
  }

  /**
   * Queue task
   * @param {IndexTask} task
   */
  private queueTask( task: IndexTask<Object> ): void {
    try {
      let queuedTask = this.queuedTasks.filter( t => t.queueName.toLowerCase() === task.queueName.toLowerCase() )[ 0 ];
      if ( !queuedTask ) {
        // Queue task
        this.queuedTasks.push( task );
        this.startNextTask( task.queueName );
      } else {
        // Join task
        try {
          task.join( queuedTask );
        } catch ( e ) {
          // Cannot join task, remove old queued task
          let i = this.queuedTasks.indexOf( queuedTask );
          if ( i > -1 ) {
            this.queuedTasks.splice( i, 1 );
          }

          // Queue task
          this.queuedTasks.push( queuedTask );
          this.startNextTask( task.queueName );
        }
      }
    } catch ( e ) {
      task.error( e );
    }
  }

  /**
   * Start next task in the queue
   * @param {string} queueName
   */
  private startNextTask( queueName: string ) {
    let runningTask = this.runningTasks.filter( t => t.queueName.toLowerCase() === queueName.toLowerCase() )[ 0 ];

    if ( runningTask ) {
      if ( runningTask.running ) {
        // Task is still running
        return;
      }
      // Remove running task
      let i = this.runningTasks.indexOf( runningTask );
      if ( i > -1 ) {
        this.runningTasks.splice( i, 1 );
      }
    }

    let queuedTask = this.queuedTasks.filter( t => t.queueName.toLowerCase() === queueName.toLowerCase() )[ 0 ];
    if ( queuedTask ) {
      try {
        // move task to running list
        this.runningTasks.push( queuedTask );
        let i = this.queuedTasks.indexOf( queuedTask );
        if ( i > -1 ) {
          this.queuedTasks.splice( i, 1 );
        }

        // Start task
        queuedTask.promise().then( () => {
          this.startNextTask( queuedTask.queueName );
        } ).catch( ( err ?: any ) => {
          this.startNextTask( queuedTask.queueName );
        } );
        queuedTask.start();
      } catch ( e ) {
        queuedTask.error( e );
      }
    }
  }


}

class IndexTask<T> {

  private _moduleTask: string;
  private _taskName: string;
  private _input: any;
  private _queueName: string;
  private _promise: Promise<T>;
  private _resolve: ( resolve: T ) => void;
  private _reject: ( reason?: any ) => void;
  private _logger: Logger;
  private _running: boolean;
  private _joined: boolean;
  private _error: boolean;

  constructor( moduleTask: string, taskName: string, input: any, queueName?: string ) {
    this._taskName   = taskName;
    this._queueName  = queueName;
    this._moduleTask = moduleTask;
    this._input      = input;
    this._logger     = LoggerFactory.create( "indexer." + taskName.toLowerCase() );
    this._promise    = new Promise( ( resolve, reject ) => {
      this._resolve = resolve;
      this._reject  = reject;
    } );
  }

  public start(): void {
    try {
      if ( this._error ) {
        throw new Error( "Cannot start a task which has already crashed" );
      } else if ( this.joined ) {
        throw new Error( "Cannot start a task which has joined another task" );
      } else if ( this.running ) {
        throw new Error( "Cannot start a task which is already running" );
      }
      this._running = true;

      // Start child process
      this.logger.info( "Start task '" + this.taskName + ":" + this.queueName + "'" );
      let startTime  = Date.now();
      let subProcess = fork( this._moduleTask );

      // Send start message
      subProcess.send( this._input );
      let message: any = null;
      subProcess.on( "message", ( m: any ) => {
        if ( this._logger.shouldLog( LogLevel.silly ) ) {
          this._logger.silly( "Received: " + JSON.stringify( m ) );
        }
        message = m;
      } );

      subProcess.on( "close", ( code: number ) => {
        try {
          this._running = false;
          let time      = (Date.now() - startTime) / 1000;
          if ( code === 0 ) {
            this.logger.info( "Finished task '" + this.taskName + ":" + this.queueName + "' (" + time + "s)" );
            this._resolve( message );
          } else {
            throw new Error( "Failed task '" + this.taskName + ":" + this.queueName + "' (" + time + "s): " + message.error );
          }
        } catch ( e ) {
          this.error( e );
        }
      } );
    } catch ( e ) {
      this.error( e );
    }
  }

  /**
   * Join another task and forward those events
   * @param {IndexTask} task
   */
  public join( task: IndexTask<T> ): void {
    if ( this._error ) {
      throw new Error( "Cannot join a crashed task" );
    } else if ( this.running ) {
      throw new Error( "Cannot join when this task is already running" );
    } else if ( task.running ) {
      throw new Error( "Cannot join a running task is already running" );
    }
    this._joined = true;
    task.promise().then( result => {
      this._resolve( result );
    } ).catch( e => {
      this._reject( e );
    } )
  }

  public promise(): Promise<T> {
    return this._promise;
  }

  public error( e?: any ) {
    this._logger.warn( "Task '" + this.taskName + ":" + this.queueName + "' failed" );
    this._error = true;
    this._reject( e );
  }

  get taskName(): string {
    return this._taskName;
  }

  get queueName(): string {
    return this._queueName;
  }

  get logger(): Logger {
    return this._logger;
  }

  get running(): boolean {
    return this._running;
  }

  get joined(): boolean {
    return this._joined;
  }
}