import { Pipe } from "../pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
/**
 * @author Steven Hermans
 */
export abstract class ProcessPipe extends Pipe<Pipe> {

  protected run():Pipe {
    this.prev.result.getProjects().forEach( title => {
      this.prev.result.getProjectVersions( title ).forEach( version => {
        this.getPrevProject(title, version);
      } );
    } );
    return this;
  }

  public getPrevProject(title:string, version:string):Project{
    let result = this.result.getProject(title, version);
    if(result == null) {
      let project = this.prev.result.getProject( title, version );
      result  = this.runEach( project );
      this.result.pushProject( result );
    }
    return result;
  }

  protected abstract runEach(project:Project):Project;
}