import { ReportRepository } from "../../repositories/report.repo";
import { ProjectService } from "../project.service";
import { ProjectSettingsRepository } from "../../repositories/project-settings.repo";
import { Injection } from "../../injections";
import { TakePipe } from "./pipes/take.pipe";
import { Pipe } from "./pipe";
import { ProjectInfo, Problem, Project } from "@maxxton/microdocs-core/domain";

/**
 * @author Steven Hermans
 */
export class AggregationPipeline {

  private _projectService:ProjectService;
  private _reportRepo:ReportRepository;
  private _projectSettingsRepo:ProjectSettingsRepository;
  private _env:string;
  private _projects:ProjectInfo[];
  private _scope:Project;
  private _problems:Problem[] = [];

  private constructor( env:string, projectService:ProjectService, reportRepo:ReportRepository, projectSettingsRepo:ProjectSettingsRepository ) {
    this._env                 = env;
    this._projectService      = projectService;
    this._reportRepo          = reportRepo;
    this._projectSettingsRepo = projectSettingsRepo;

    // preload all projectInfo's
    this._projects = this._reportRepo.getProjects( env );
  }

  /**
   * Get current environment
   * @return {string}
   */
  get env():string {
    return this._env;
  }

  get projectService():ProjectService {
    return this._projectService;
  }

  get reportRepo():ReportRepository {
    return this._reportRepo;
  }

  get projectSettingsRepo():ProjectSettingsRepository {
    return this._projectSettingsRepo;
  }


  /**
   * Add report as input for the pipeline
   * @param report
   */
  public take = ( report:Project ):Pipe<any> => {
    this._scope = report;
    return new TakePipe( this, report ).process();
  };

  /**
   * Add report as input for the pipeline
   */
  public takeEverything = ():Pipe<any> => {
    return new TakePipe( this ).process();
  };

  /**
   * Add report as input for the pipeline
   * @param maxAmount
   */
  public takeLatest = ( maxAmount:number = 1 ):Pipe<any> => {
    return new TakePipe( this, maxAmount ).process();
  };

  /**
   * Get preloaded project info's
   * @return {ProjectInfo[]}
   */
  get projects():ProjectInfo[] {
    return this._projects;
  }

  /**
   * Get the project scope
   * @return {Project}
   */
  get scope():Project {
    return this._scope;
  }

  get problems():Problem[] {
    return this._problems;
  }

  public addProblems( problems:Problem[] ):void {
    problems.forEach( problem => this._problems.push( problem ) );
  }

}

export function pipe( injection:Injection, env:string ):AggregationPipeline {
  return new AggregationPipeline( env, injection.ProjectService(), injection.ReportRepository(), injection.ProjectSettingsRepository() );
}