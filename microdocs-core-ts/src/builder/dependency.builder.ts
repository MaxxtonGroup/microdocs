import {Dependency} from "../domain/dependency/dependency.model";
import {Builder} from "./builder";
import {PathBuilder} from "./path.builder";

export class DependencyBuilder implements Builder<Dependency> {

  private _dependency: Dependency;
  private _title: string;

  constructor(type?: string) {
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
    if (!this._dependency.paths) {
      this._dependency.paths = {};
    }
    if (!this._dependency.paths[pathBuilder.path]) {
      this._dependency.paths[pathBuilder.path] = {};
    }
    pathBuilder.methods.forEach(method => {
      this._dependency.paths[pathBuilder.path][method] = pathBuilder.build();
    });
  }

}