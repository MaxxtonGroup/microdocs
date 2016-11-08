import { AggregationActions } from "./aggregation-actions";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { AggregationResult } from "./aggregation-result";
/**
 * @author Steven Hermans
 */
export class Pipe<T> extends AggregationActions{

  private _prev:Pipe;
  private _next:Pipe;
  private _action:(pipe:Pipe) => T;
  private _result:AggregationResult;

  get prev():Pipe{
    return this._prev;
  }

  get next():Pipe{
    return this._prev;
  }

  get first():Pipe{
    if(this._prev){
      return this._prev.first;
    }
    return this;
  }

  get last():Pipe{
    if(this._next){
      return this._next.last;
    }
    return this;
  }

  get result():AggregationResult {
    return this._result;
  }

  private process():T{
    if(this._prev){
      this._prev.process();
    }

    let result = this._action(this);

    return result;
  }

  public getProject(title:string, version:string):Project{
    return this._result.getProject(title, version);
  }
}