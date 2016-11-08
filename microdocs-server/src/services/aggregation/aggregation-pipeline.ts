import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { PreProcessor, MicroDocsPreProcessor } from "@maxxton/microdocs-core/pre-processor";


import { AggregationResult } from "./aggregation-result";
import * as funcs from  './func';
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { ReportRepository } from "../../repositories/report.repo";
import { ProjectService } from "../project.service";
import { ProjectSettingsRepository } from "../../repositories/project-settings.repo";
import { Injection } from "../../injections";

/**
 * @author Steven Hermans
 */
export class AggregationPipeline {

  private projectService:ProjectService;
  private reportRepo:ReportRepository;
  private projectSettingsRepo:ProjectSettingsRepository;
  private preProcessor:PreProcessor = null;

  private env:string;
  private result:AggregationResult;

  private prev:AggregationPipeline;
  private next:AggregationPipeline;
  private action:()=>any;

  private constructor( env:string, projectService:ProjectService, reportRepo:ReportRepository, projectSettingsRepo:ProjectSettingsRepository ) {
    this.env = env;
    this.projectService = projectService;
    this.reportRepo = reportRepo;
    this.projectSettingsRepo = projectSettingsRepo;
  }

  /**
   * Add report as input for the pipeline
   * @param report
   */
  public take = ( report:Project ):AggregationPipeline => funcs.take( this, report );

  /**
   * Add report as input for the pipeline
   */
  public takeEverything = ():AggregationPipeline => funcs.takeEverything( this );

  /**
   * Add report as input for the pipeline
   * @param maxAmount
   */
  public takeLatest = ( maxAmount:number = 1 ):AggregationPipeline => funcs.takeLatest( this, maxAmount );

  /**
   * PreProcess a report based on the project settings
   * @param report project to be processed
   */
  public preProcess = ( project:Project ):Project => funcs.preProcess( this, project );

  /**
   * Set the PreProcessor to use, null is none
   * @param preProcessor
   * @return {AggregationPipeline}
   */
  public setPreProcessor( preProcessor:PreProcessor ):AggregationPipeline {
    this.preProcessor = preProcessor;
    return this;
  }

  /**
   * Get the PreProcessor, null is none
   * @return {PreProcessor}
   */
  public getPreProcessor():PreProcessor {
    return this.preProcessor;
  }

  /**
   * Get the aggregation result
   * @return {AggregationResult}
   */
  public getResult():AggregationResult {
    return this.result;
  }

  /**
   * Get current environment
   * @return {string}
   */
  public getEnv():string {
    return this.env;
  }

  public getReportRepository():ReportRepository{
    return this.reportRepo;
  }

  public getProjectService():ProjectService{
    return this.projectService;
  }

  public getProjectSettingsRepository():ProjectSettingsRepository {
    return this.projectSettingsRepo;
  }


}

export function pipe( injection:Injection, env:string ):AggregationPipeline {
  return new AggregationPipeline( env, injection.ProjectService(), injection.ReportRepository(), injection.ProjectSettingsRepository() );
}

export const defaultPreProcessor:()=>PreProcessor = () => new MicroDocsPreProcessor();