
import {Builder} from "./builder";
import {Path} from "../domain/path/path.model";

export class PathBuilder implements Builder<Path>{

  private _endpoint: Path = {};
  private _path: string;
  private _methods: string[] = [];

  get endpoint():Path{
    return this._endpoint;
  }

  set path(path:string){
    this._path = path;
  }

  get path():string{
    return this._path;
  }

  set methods(methods:string[]){
    this._methods = methods;
  }

  get methods():string[]{
    return this._methods;
  }
  build(): Path {
    return this._endpoint;
  }


}