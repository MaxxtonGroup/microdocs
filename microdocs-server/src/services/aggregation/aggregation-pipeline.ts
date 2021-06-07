import { ReportRepository } from "../../repositories/report.repo";
import { ProjectService } from "../project.service";
import { ProjectSettingsRepository } from "../../repositories/project-settings.repo";
import { Injection } from "../../injections";
import { TakePipe } from "./pipes/take.pipe";
import { Pipe } from "./pipe";
import { ProjectInfo, Problem, Project } from "@maxxton/microdocs-core/domain";
import { Hook } from './hooks/hook';
import { AggregationResult } from './aggregation-result';

/**
 * @author Steven Hermans
 */
export class AggregationPipeline {

  private _injection: Injection;
  private _projectService: ProjectService;
  private _reportRepo: ReportRepository;
  private _projectSettingsRepo: ProjectSettingsRepository;
  private _env: string;
  private _projects: Array<ProjectInfo>;
  private _scope: Project;
  private _problems: Array<Problem> = [];
  private _postHooks: Array<Hook> = [];
  private _next: Pipe<any>;

  public constructor( env: string, injection: Injection, projectService: ProjectService, reportRepo: ReportRepository, projectSettingsRepo: ProjectSettingsRepository ) {
    this._env                 = env;
    this._injection           = injection;
    this._projectService      = projectService;
    this._reportRepo          = reportRepo;
    this._projectSettingsRepo = projectSettingsRepo;

    // preload all projectInfo's
    this._projects = this._reportRepo && this._reportRepo.getProjects( env );
  }

  /**
   * Get current environment
   * @return {string}
   */
  get env(): string {
    return this._env;
  }

  get projectService(): ProjectService {
    return this._projectService;
  }

  get reportRepo(): ReportRepository {
    return this._reportRepo;
  }

  get projectSettingsRepo(): ProjectSettingsRepository {
    return this._projectSettingsRepo;
  }

  get injections(): Injection {
    return this._injection;
  }


  /**
   * Add report as input for the pipeline
   * @param report
   */
  public take = ( report: Project ): Pipe<any> => {
    console.info('take ' + report.info.title);
    if (this._next) {
      throw new Error("Pipe already started");
    }
    this._scope = report;
    this._next = new TakePipe( this, report ).process();
    return this._next;
  }

  /**
   * Add report as input for the pipeline
   */
  public takeEverything = (): Pipe<any> => {
    console.info('take everything');
    if (this._next) {
      throw new Error("Pipe already started");
    }
    this._next = new TakePipe( this ).process();
    return this._next;
  }

  /**
   * Add report as input for the pipeline
   * @param maxAmount
   */
  public takeLatest = ( maxAmount: number = 1 ): Pipe<any> => {
    console.info('take latest ' + maxAmount);
    if (this._next) {
      throw new Error("Pipe already started");
    }
    this._next = new TakePipe( this, maxAmount ).process();
    return this._next;
  }

  /**
   * Get preloaded project info's
   * @return {ProjectInfo[]}
   */
  get projects(): Array<ProjectInfo> {
    return this._projects;
  }

  /**
   * Get the project scope
   * @return {Project}
   */
  get scope(): Project {
    return this._scope;
  }

  get problems(): Array<Problem> {
    return this._problems;
  }

  public addProblems( problems: Array<Problem> ): void {
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
    if (this._next) {
      return this._next.first;
    }
    return null;
  }

  /**
   * Get the last pipe
   * @return {Pipe}
   */
  get last(): Pipe<any> {
    if (this._next) {
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
    if (this._postHooks.length > 0) {
      setTimeout(() => {
        try {
          for (let i = 0; i < this._postHooks.length; i++) {
            this._postHooks[i].run(this, this._injection);
          }
        } catch (e) {
          console.error(e);
        }
      }, 20);
    }
  }

}

export function pipe( injection: Injection, env: string ): AggregationPipeline {
  return new AggregationPipeline( env, injection, injection.ProjectService(), injection.ReportRepository(), injection.ProjectSettingsRepository() );
}
