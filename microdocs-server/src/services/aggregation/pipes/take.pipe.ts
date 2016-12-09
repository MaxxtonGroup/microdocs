import { Pipe } from "../pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { AggregationPipeline } from "../aggregation-pipeline";
import { takeEverything, takeLatest } from "../funcs/take.func";
import { ProjectInfo } from "@maxxton/microdocs-core/domain/common/project-info.model";
/**
 * @author Steven Hermans
 */
export class TakePipe extends Pipe<any> {

  private _versionAmount:number;

  /**
   * Take everything
   */
  constructor(pipeline:AggregationPipeline);
  /**
   * Take only this report
   * @param report
   */
  constructor(pipeline:AggregationPipeline, report:Project);

  /**
   * Take latest version(s)
   * @param versionAmount how many versions to take, -1 is everything
   */
  constructor(pipeline:AggregationPipeline, versionAmount:number);

  constructor(pipeline:AggregationPipeline, arg?:any){
    super(pipeline);
    if(arg == undefined){
      this._versionAmount = -1;
    }else if(typeof(arg) === 'number'){
      this._versionAmount = <number>arg;
    }else if(typeof(arg) === 'object'){
      this._versionAmount = 0;
      let report = <Project>arg;
      this.result.pushProject(report);
      let projectInfo = this.projects.filter(info => info.title === report.info.title)[0];
      if(!projectInfo){
        projectInfo = new ProjectInfo(report.info.title, report.info.group, report.info.version, [report.info.version]);
        this.projects.push(projectInfo);
      }else{
        if(projectInfo.versions.filter(version => version === report.info.version).length == 0){
          projectInfo.versions.push(report.info.version);
          projectInfo.versions = projectInfo.versions.sort();
          projectInfo.version = projectInfo.versions[projectInfo.versions.length-1];
        }
      }
    }
  }

  run():Pipe<any> {
    if(this._versionAmount < 0){
      takeEverything(this);
    }else if(this._versionAmount > 0){
      takeLatest(this, this._versionAmount);
    }
    return this;
  }

}