
import { CrudRepository } from "./crud.repository";
import * as pathUtil from "path";
import { Repo } from "../../domain/repos/repo.model";
import { RepoRepository } from "../../domain/repos/repo.repository";
import { Project } from "../../domain/projects/project.model";

export class JsonRepoRepository extends CrudRepository<Repo> implements RepoRepository {

  constructor(storageFolder: string, project: Project){
    super(pathUtil.join(storageFolder, "repos", project.code));
  }

  protected getId(model: Repo): string {
    return model.code;
  }

  protected deserialize(data: string): Repo {
    let options = JSON.parse(data);
    return new Repo(options);
  }

}