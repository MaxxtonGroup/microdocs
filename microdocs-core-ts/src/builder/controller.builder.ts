import {Builder} from "./builder";
import {PathBuilder} from "./path.builder";
/**
 * @author Steven Hermans
 */
export class ControllerBuilder implements Builder<PathBuilder[]> {
  
  public baseUrl:string = '';
  public requestMethods:string[] = [];
  private pathBuilders:PathBuilder[] = [];
  
  path(pathBuilder:PathBuilder):void {
    this.pathBuilders.push(pathBuilder);
  }
  
  build():PathBuilder[] {
    return this.pathBuilders;
  }
  
  
}