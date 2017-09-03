import { Project, ProjectTree, ProjectInfo, Problem } from "@maxxton/microdocs-core/domain";
import { AggregationResult } from "./aggregation-result";
import { AggregationPipeline } from "./aggregation-pipeline";
import { Hook } from './hooks/hook';

/**
 * @author Steven Hermans
 */
export abstract class Pipe<T> {

  private _pipeline: AggregationPipeline;
  private _prev: Pipe<any>;
  private _next: Pipe<any>;
  private _result: AggregationResult = new AggregationResult();

  constructor( pipeline: AggregationPipeline ) {
    this._pipeline = pipeline;
  }

  /**
   * Get previous pipe
   * @return {Pipe} previous pipe or null if this is the first one
   */
  get prev(): Pipe<any> {
    return this._prev;
  }

  /**
   * Get next pipe
   * @return {Pipe} next pipe or null if this is the last one
   */
  get next(): Pipe<any> {
    return this._prev;
  }

  /**
   * Get the first pipe
   * @return {Pipe}
   */
  get first(): Pipe<any> {
    if ( this._prev ) {
      return this._prev.first;
    }
    return this;
  }

  /**
   * Get the last pipe
   * @return {Pipe}
   */
  get last(): Pipe<any> {
    if ( this._next ) {
      return this._next.last;
    }
    return this;
  }

  /**
   * Get the result of this pipe
   * @return {AggregationResult}
   */
  get result(): AggregationResult {
    return this._result;
  }

  protected forwardResult(): void {
    this._result = this.prev._result;
  }

  /**
   * Process this pipe
   * @return {T}
   */
  public process(): T {

    let out = this.run();

    return out;
  }

  /**
   * Implemented run function
   */
  protected abstract run(): T;

  /**
   * Load a project from the previous pipe
   * @param title
   * @param version
   * @return {Project}
   */
  public getPrevProject( title: string, version: string ): Project {
    if ( this._prev ) {
      let project = this._prev._result.getProject( title, version );
      if ( project ) {
        return project;
      } else {
        return this._prev.getPrevProject( title, version );
      }
    }
    return null;
  }

  /**
   * Find next version of the project which is not deprecated
   * @param title
   * @param lastVersion
   * @return {Project} or null
   */
  public getPrevProjectVersion( title: string, lastVersion?: string ): Project {
    let projectInfos = this.projects.filter( info => info.title === title );
    if ( projectInfos.length > 0 ) {
      let versions    = projectInfos[ 0 ].getVersions();
      let nextVersion = versions[ versions.length - 1 ];
      if ( lastVersion ) {
        let index = versions.indexOf( lastVersion );
        if ( index > -1 ) {
          if ( index - 1 >= 0 ) {
            nextVersion = versions[ index - 1 ];
          } else {
            return null; // no versions
          }
        }
      }
      let project = this.getPrevProject( title, nextVersion );
      if ( !project || project.deprecated === true ) {
        return this.getPrevProjectVersion( title, nextVersion );
      }
      return project;
    }
    return null;
  }

  /**
   * Get current environment
   * @return {string}
   */
  get env(): string {
    return this.pipeline.env;
  }

  get reportRepo(): ReportRepository {
    return this.pipeline.reportRepo;
  }

  get projectSettingsRepo(): ProjectSettingsRepository {
    return this.pipeline.projectSettingsRepo;
  }

  get projectService(): ProjectService {
    return this.pipeline.projectService;
  }

  /**
   * Get pipeline
   * @return {string}
   */
  get pipeline(): AggregationPipeline {
    return this._pipeline;
  }

  /**
   * Get preloaded project info's
   * @return {ProjectInfo[]}
   */
  get projects(): ProjectInfo[] {
    return this.pipeline.projects;
  }

  /**
   * Remove report from the current pipe
   * @return {Pipe} return this pipe
   */
  public remove( title:string ): Pipe<any> {
    this.result.removeProject(title);
    return this;
  }

  /**
   * Add a report to the current pipe
   * @return {Pipe} return this pipe
   */
  public take( report: Project ): Pipe<any> {
    this.result.pushProject( report );
    let projectInfo = this.projects.filter( info => info.title === report.info.title )[ 0 ];
    if ( !projectInfo ) {
      projectInfo = new ProjectInfo( report.info.title, report.info.group, report.info.version, [ report.info.version ] );
      this.projects.push( projectInfo );
    } else {
      if ( projectInfo.getVersions().filter( version => version === report.info.version ).length == 0 ) {
        projectInfo.getVersions().push( report.info.version );
        projectInfo.version  = projectInfo.getVersions()[ projectInfo.getVersions().length - 1 ];
      }
    }
    return this;
  }

  /**
   * PreProcess each project
   * @return {Pipe}
   */
  public preProcess(): Pipe<any> {
    console.info( 'preProcess' );
    let pipe   = new PreProcessPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Resolve include dependencies
   * @return {Pipe}
   */
  public combineIncludes(): Pipe<any> {
    console.info( 'combine Includes' );
    let pipe   = new IncludesPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Resolve REST dependencies
   * @param scope only check dependencies for this scope if present
   * @return {Pipe}
   */
  public resolveRestDependencies( scope?: Project ): Pipe<any> {
    console.info( 'resolve Rest Dependencies' );
    let pipe   = new RestDependenciesPipe( this.pipeline, scope );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Resolve REST dependencies
   * @param scope only check dependencies for this scope if present
   * @return {Pipe}
   */
  public resolveUsesDependencies( scope?: Project ): Pipe<any> {
    console.info( 'resolve Uses Dependencies' );
    let pipe   = new UsesDependenciesPipe( this.pipeline, scope );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Resolve REST dependencies
   * @return {Pipe}
   */
  public storeIndex(): Pipe<any> {
    console.info( 'store Index' );
    let pipe   = new StoreIndexPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Resolve REST dependencies
   * @return {Pipe}
   */
  public storeProjects(): Pipe<any> {
    console.info( 'store Projects' );
    let pipe   = new StoreProjectsPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Build tags
   * @return {Pipe}
   */
  public buildTags(): Pipe<any> {
    console.info( 'build Tags' );
    let pipe   = new BuildTagsPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Build tags
   * @return {Pipe}
   */
  public postAction(hook:Hook): Pipe<any> {
    this._pipeline.addHook(hook);
    return this;
  }

  /**
   * Return result as project tree
   * @return {ProjectTree}
   */
  public asTree(): ProjectTree {
    console.info( 'as Tree' );
    let pipe   = new TreePipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    let result = pipe.process();
    this._pipeline.finish();
    return result;
  }

  /**
   * Return all found problems
   * @return {Problem[]}
   */
  public asProblems(): Problem[] {
    console.info( 'as Problems' );
    let pipe   = new ProblemsPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    let result = pipe.process();
    this._pipeline.finish();
    return result;
  }
}

// This needs to be at the end, because these are inheritance of Pipe, so Pipe has te be initialized first
import {
  PreProcessPipe,
  IncludesPipe,
  RestDependenciesPipe,
  StoreIndexPipe,
  StoreProjectsPipe,
  ProblemsPipe,
  BuildTagsPipe,
  TreePipe
} from "./pipes";
import { UsesDependenciesPipe } from "./pipes/uses-dependencies.pipe";