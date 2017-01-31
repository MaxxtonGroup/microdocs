import {Dependency} from "../domain/dependency/dependency.model";
import {Builder} from "./builder";
import {PathBuilder} from "./path.builder";

export class DependencyBuilder implements Builder<Dependency> {

  private _dependency: Dependency;
  private _title: string;
  public baseUrl:string = '';
  public requestMethods:string[] = [];

  constructor(type:string = undefined) {
    this._dependency = {type: type};
  }

  get dependency(): Dependency {
    return this._dependency;
  }

  get title(): string {
    return this._title
  }

  set title(value: string) {
    this._title = value;
  }

  build(): Dependency {
    return this._dependency;
  }

  path(pathBuilder: PathBuilder): void {
    let path = this.baseUrl + pathBuilder.path;
    let requestMethods = pathBuilder.methods.concat(this.requestMethods).map(method => method.toLowerCase());

    if(!path || path == ''){
      throw new Error("No path found for endpoint");
    }
    if(!requestMethods || requestMethods.length == 0){
      throw new Error("No request methods found for endpoint");
    }


    if (!this._dependency.paths) {
      this._dependency.paths = {};
    }
    if (!this._dependency.paths[path]) {
      this._dependency.paths[path] = {};
    }
    pathBuilder.methods.forEach(method => {
      this._dependency.paths[path][method] = pathBuilder.build();
    });
  }

}