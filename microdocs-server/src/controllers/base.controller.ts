

import { ProjectService } from "../domain/projects/project.service";
import { ProjectRepository } from "../domain/projects/project.repository";
import { JsonProjectRepository } from "../repositories/json/json-project.repository";
import { Project } from "../domain/projects/project.model";
import { RepoService } from "../domain/repos/repo.service";
import { RepoRepository } from "../domain/repos/repo.repository";
import { JsonRepoRepository } from "../repositories/json/repo-project.repository";
import { storage } from "../config/settings";

export class BaseController {

  get projectService() : ProjectService {
    return new ProjectService(this.projectRepository);
  }

  get projectRepository(): ProjectRepository {
    return new JsonProjectRepository(storage.file.path);
  }

  repoService(project: Project): RepoService {
    return new RepoService(this.repoRepository(project));
  }

  repoRepository(project: Project): RepoRepository {
    return new JsonRepoRepository(storage.file.path, project);
  }


}