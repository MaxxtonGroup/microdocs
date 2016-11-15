import { Project, ProjectTree, ProjectInfo, Problem } from "@maxxton/microdocs-core/domain";
import { AggregationResult } from "./aggregation-result";
import { ProjectService } from "../project.service";
import { ReportRepository } from "../../repositories/report.repo";
import { ProjectSettingsRepository } from "../../repositories/project-settings.repo";
import { AggregationPipeline } from "./aggregation-pipeline";
/**
 * @author Steven Hermans
 */
export abstract class Pipe<T> {

  private _pipeline:AggregationPipeline;
  private _prev:Pipe<any>;
  private _next:Pipe<any>;
  private _result:AggregationResult = new AggregationResult();

  constructor( pipeline:AggregationPipeline ) {
    this._pipeline = pipeline;
  }

  /**
   * Get previous pipe
   * @return {Pipe} previous pipe or null if this is the first one
   */
  get prev():Pipe<any> {
    return this._prev;
  }

  /**
   * Get next pipe
   * @return {Pipe} next pipe or null if this is the last one
   */
  get next():Pipe<any> {
    return this._prev;
  }

  /**
   * Get the first pipe
   * @return {Pipe}
   */
  get first():Pipe<any> {
    if ( this._prev ) {
      return this._prev.first;
    }
    return this;
  }

  /**
   * Get the last pipe
   * @return {Pipe}
   */
  get last():Pipe<any> {
    if ( this._next ) {
      return this._next.last;
    }
    return this;
  }

  /**
   * Get the result of this pipe
   * @return {AggregationResult}
   */
  get result():AggregationResult {
    return this._result;
  }

  /**
   * Process this pipe
   * @return {T}
   */
  public process():T {
    if ( this._prev ) {
      this._prev.process();
    }

    let result = this.run();

    return result;
  }

  /**
   * Implemented run function
   */
  protected abstract run():T;

  /**
   * Load a project from the previous pipe
   * @param title
   * @param version
   * @return {Project}
   */
  public getPrevProject( title:string, version:string ):Project {
    if ( this._prev ) {
      return this._prev._result.getProject( title, version );
    }
    return null;
  }

  /**
   * Find next version of the project which is not deprecated
   * @param title
   * @param lastVersion
   * @return {Project} or null
   */
  public getPrevProjectVersion( title:string, lastVersion?:string ):Project {
    let projectInfos = this.projects.filter( info => info.title === title );
    if ( projectInfos.length > 0 ) {
      let versions    = projectInfos[ 0 ].versions;
      let nextVersion = versions[ versions.length - 1 ];
      if ( lastVersion ) {
        let index = versions.indexOf( lastVersion );
        if ( index > -1 ) {
          if ( index - 1 >= 0 ) {
            nextVersion = versions[ index - 1 ];
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
  get env():string {
    return this.pipeline.env;
  }

  get reportRepo():ReportRepository {
    return this.pipeline.reportRepo;
  }

  get projectSettingsRepo():ProjectSettingsRepository {
    return this.pipeline.projectSettingsRepo;
  }

  get projectService():ProjectService {
    return this.pipeline.projectService;
  }

  /**
   * Get pipeline
   * @return {string}
   */
  get pipeline():AggregationPipeline {
    return this._pipeline;
  }

  /**
   * Get preloaded project info's
   * @return {ProjectInfo[]}
   */
  get projects():ProjectInfo[] {
    return this.pipeline.projects;
  }

  /**
   * PreProcess each project
   * @return {Pipe}
   */
  public preProcess():Pipe<any> {
    let pipe   = new PreProcessPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Resolve include dependencies
   * @return {Pipe}
   */
  public combineIncludes():Pipe<any> {
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
  public resolveRestDependencies( scope?:Project ):Pipe<any> {
    let pipe   = new RestDependenciesPipe( this.pipeline, scope );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Resolve REST dependencies
   * @return {Pipe}
   */
  public storeIndex():Pipe<any> {
    let pipe   = new StoreIndexPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Resolve REST dependencies
   * @return {Pipe}
   */
  public storeProjects():Pipe<any> {
    let pipe   = new StoreProjectsPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Build tags
   * @return {Pipe}
   */
  public buildTags():Pipe<any> {
    let pipe   = new BuildTagsPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Return result as project tree
   * @return {ProjectTree}
   */
  public asTree():ProjectTree {
    let pipe   = new TreePipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
  }

  /**
   * Return all found problems
   * @return {Problem[]}
   */
  public asProblems():Problem[] {
    let pipe   = new ProblemsPipe( this.pipeline );
    pipe._prev = this;
    this._next = pipe;
    return pipe.process();
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