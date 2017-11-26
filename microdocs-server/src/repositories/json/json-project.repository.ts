
import { CrudRepository } from "./crud.repository";
import { ProjectRepository } from "../../domain/projects/project.repository";
import { Project } from "../../domain/projects/project.model";
import * as pathUtil from "path";

export class JsonProjectRepository extends CrudRepository<Project> implements ProjectRepository {

  constructor(storageFolder: string){
    super(pathUtil.join(storageFolder, "projects"));
  }

  protected getId(model: Project): string {
    return model.code;
  }

  protected deserialize(data: string): Project {
    let options = JSON.parse(data);
    return new Project(options);
  }

}