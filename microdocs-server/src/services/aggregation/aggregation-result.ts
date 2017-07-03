import { Project } from "@maxxton/microdocs-core/domain/project.model";
/**
 * @author Steven Hermans
 */
export class AggregationResult{

  private _result:Project[] = [];

  public pushProject(project:Project):void{
    if(this.getProject(project.info.title, project.info.version) == null){
      this._result.push(project);
    }
  }

  public getProjects():string[]{
    let projectTitles:string[] = [];
    this._result.forEach( project => {
      if(projectTitles.indexOf(project.info.title) == -1){
        projectTitles.push(project.info.title);
      }
    });
    return projectTitles;
  }

  public getProjectVersions(title:string):string[] {
    return this._result.filter( project => project.info.title === title).map( project => project.info.version);
  }

  public getLatestProjectVersion(title:string):string {
    let project = this._result.filter( project => project.info.title === title)[0];
    if(project){
      return project.info.getLatestVersion().version;
    }
    return null;
  }

  public getProject(title:string, version:string):Project {
    let matches = this._result.filter( project => project.info.title === title && project.info.version === version);
    if(matches.length > 0){
      return matches[0];
    }
    return null;
  }

  get projectList():Project[] {
    return this._result;
  }

}

