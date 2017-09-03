import { TakePipe } from "./pipes/take.pipe";
import { Pipe } from "./pipe";
import { ProjectInfo, Problem, Project, ProjectMetadata } from "@maxxton/microdocs-core/domain";
import { Hook } from './hooks/hook';
import { AggregationResult } from './aggregation-result';
import { Environment } from "../../domain/environment.model";
import { ProjectService } from "../../../dist/services/project.service";
import { SettingsService } from "../../services/settings.service";

/**
 * @author Steven Hermans
 */
export class AggregationPipeline {

  private _env: Environment;
  private _projects: Promise<ProjectMetadata[]>;
  private _scope: Project;
  private _problems: Problem[] = [];
  private _postHooks: Hook[]   = [];
  private _next: Pipe<any>;
  private _projectService: ProjectService;
  private _settingsService: SettingsService;

  public constructor( env: Environment, projectService: ProjectService, settingsService: SettingsService ) {
    this._env             = env;
    this._projectService  = projectService;
    this._settingsService = settingsService;

    // preload all projectInfo's
    this._projects = projectService.getProjectMetadatas( env );
  }

  /**
   * Get current environment
   * @return {string}
   */
  get env(): Environment {
    return this._env;
  }

  get projectService(): ProjectService {
    return this._projectService;
  }

  get settingsService(): SettingsService {
    return this._settingsService;
  }

  /**
   * Add report as input for the pipeline
   * @param report
   */
  public take = ( report: Project ): Pipe<any> => {
    console.info( 'take ' + report.info.title );
    if ( this._next ) {
      throw new Error( "Pipe already started" );
    }
    this._scope = report;
    this._next  = new TakePipe( this, report ).process();
    return this._next;
  };

  /**
   * Add report as input for the pipeline
   */
  public takeEverything = (): Pipe<any> => {
    console.info( 'take everything' );
    if ( this._next ) {
      throw new Error( "Pipe already started" );
    }
    this._next = new TakePipe( this ).process();
    return this._next;
  };

  /**
   * Add report as input for the pipeline
   * @param maxAmount
   */
  public takeLatest = ( maxAmount: number = 1 ): Pipe<any> => {
    console.info( 'take latest ' + maxAmount );
    if ( this._next ) {
      throw new Error( "Pipe already started" );
    }
    this._next = new TakePipe( this, maxAmount ).process();
    return this._next;
  };

  /**
   * Get preloaded project info's
   * @return {ProjectInfo[]}
   */
  get projects(): Promise<ProjectMetadata[]> {
    return this._projects;
  }

  /**
   * Get the project scope
   * @return {Project}
   */
  get scope(): Project {
    return this._scope;
  }

  get problems(): Problem[] {
    return this._problems;
  }

  public addProblems( problems: Problem[] ): void {
    problems.forEach( problem => this._problems.push( problem ) );
  }

  public addHook( hook: Hook ): void {
    this._postHooks.push( hook );
  }

  /**
   * Get the first pipe
   * @return {Pipe}
   */
  get first(): Pipe<any> {
    if ( this._next ) {
      return this._next.first;
    }
    return null;
  }

  /**
   * Get the last pipe
   * @return {Pipe}
   */
  get last(): Pipe<any> {
    if ( this._next ) {
      return this._next.last;
    }
    return null;
  }

  /**
   * Get the result of this pipe
   * @return {AggregationResult}
   */
  get result(): AggregationResult {
    return this.last.result;
  }

  public finish(): void {
    if ( this._postHooks.length > 0 ) {
      setTimeout( () => {
        try {
          for ( let i = 0; i < this._postHooks.length; i++ ) {
            this._postHooks[ i ].run( this );
          }
        } catch ( e ) {
          console.error( e );
        }
      }, 20 );
    }
  }

}

export function pipe( env: string, projectService: ProjectService, settingsService: SettingsService ): AggregationPipeline {
  return new AggregationPipeline( env, projectService, settingsService );
}