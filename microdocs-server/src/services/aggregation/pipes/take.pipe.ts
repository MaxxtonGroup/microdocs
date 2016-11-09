import { Pipe } from "../pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { AggregationPipeline } from "../aggregation-pipeline";
import { takeEverything, takeLatest } from "../func/take.func";
/**
 * @author Steven Hermans
 */
export class TakePipe extends Pipe<Pipe> {

  private _versionAmount:number;

  /**
   * Take everything
   */
  constructor(pipeline:AggregationPipeline){
    super(pipeline);
    this(pipeline, -1);
  }

  /**
   * Take only this report
   * @param report
   */
  constructor(pipeline:AggregationPipeline, report:Project){
    super(pipeline);
    this(pipeline, 0);
    this.result.pushProject(report);
  }

  /**
   * Take latest version(s)
   * @param versionAmount how many versions to take, -1 is everything
   */
  constructor(pipeline:AggregationPipeline, versionAmount:number = 1){
    super(pipeline);
    this._versionAmount = versionAmount;
  }

  run():Pipe {
    if(this._versionAmount < 0){
      takeEverything(this);
    }else if(this._versionAmount > 0){
      takeLatest(this, this._versionAmount);
    }
    return this;
  }

}