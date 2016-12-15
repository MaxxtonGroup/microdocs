import { Pipe } from "../pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
/**
 * @author Steven Hermans
 */
export abstract class ProcessPipe extends Pipe<any> {

  protected run():Pipe<any> {
    this.prev.result.getProjects().forEach( (title:string) => {
      this.prev.result.getProjectVersions( title ).forEach( (version:string) => {
        this.getPrevProject(title, version);
      } );
    } );
    return this;
  }

  public getPrevProject(title:string, version:string):Project{
    let result = this.result.getProject(title, version);
    if(result == null) {
      let project = this.prev.result.getProject( title, version );
      if(project) {
        result = this.runEach( project );
        this.result.pushProject( result );
      } else {
        return this.prev.getPrevProject( title, version );
      }
    }
    return result;
  }

  protected abstract runEach(project:Project):Project;
}