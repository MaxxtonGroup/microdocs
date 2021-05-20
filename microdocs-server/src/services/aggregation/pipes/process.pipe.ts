import { Pipe } from "../pipe";
import { Project } from "@maxxton/microdocs-core/dist/domain/project.model";

/**
 * @author Steven Hermans
 */
export abstract class ProcessPipe extends Pipe<any> {

  private processedProjects: Array<string> = [];

  protected run(): Pipe<any> {
    this.processedProjects = [];
    this.prev.result.getProjects().forEach((title: string) => {
      this.prev.result.getProjectVersions(title).forEach((version: string) => {
        this.getPrevProject(title, version);
      });
    });
    return this;
  }

  public getPrevProject(title: string, version: string): Project {
    let result = this.result.getProject(title, version);
    if (result == null) {
      const project = this.prev.result.getProject(title, version);
      if (project) {
        if (this.processedProjects.indexOf(project.info.title + ":" + project.info.version) === -1) {
          this.processedProjects.push(project.info.title + ":" + project.info.version);
          console.info("do: " + project.info.title + ":" + project.info.version);
          result = this.runEach(project);
          this.result.pushProject(result);
        } else {
          result = project;
        }
      } else {
        return this.prev.getPrevProject(title, version);
      }
    }
    return result;
  }

  protected abstract runEach(project: Project): Project;
}
