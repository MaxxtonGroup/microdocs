import {Component, Input, Output, EventEmitter, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {Project, Problem, ProblemResponse} from "@maxxton/microdocs-core/domain";
import {ProjectService} from "../../services/project.service";
import * as yaml from 'js-yaml';

/**
 * @author Steven Hermans
 */
@Component({
  selector: 'import-dialog',
  templateUrl: 'import-dialog.component.html',
  styleUrls: ['import-dialog.component.scss']
})
export class ImportDialogComponent{

  project:Project = null;
  projectInfo:ProjectInfo = new ProjectInfo();

  jsonError:string = "";
  generalError:string = "";
  problemsErrors:string[] = [];
  valid:boolean = false;
  text:string = '';

  constructor(private projectService:ProjectService, private router:Router){}

  onProjectInserted(text){
    this.text = text;
    this.jsonError = "";
    try{
      this.project = JSON.parse(this.text);
    }catch(e){
      try{
        this.project = yaml.load(this.text);
      }catch(ee){
        this.valid = false;
        this.jsonError = "Invalid json";
        return;
      }
    }

    if(this.project.info){
      if(this.project.info.title)
        this.projectInfo.title = this.project.info.title;
      if(this.project.info.group)
        this.projectInfo.group = this.project.info.group;
      if(this.project.info.version)
        this.projectInfo.version = this.project.info.version;
    }
  }

  onSubmit(){
    this.generalError = "";
    this.problemsErrors = [];
    if(this.jsonError){
      this.generalError = this.jsonError;
      return;
    }

    if(!this.projectInfo.title || this.projectInfo.title.trim() === ""){
      this.generalError = "Project name is empty";
      return;
    }
    if(!this.projectInfo.group || this.projectInfo.group.trim() === ""){
      this.generalError = "Group is empty";
      return;
    }
    if(!this.projectInfo.version || this.projectInfo.version.trim() === ""){
      this.generalError = "Version is empty";
      return;
    }

    this.projectService.importProject(this.project, this.projectInfo.title, this.projectInfo.group, this.projectInfo.version).subscribe((problemResponse:ProblemResponse) => {
      if(problemResponse.status === 'ok') {
        let url = "/projects/" + this.projectInfo.group + "/" + this.projectInfo.title + "?version=" + this.projectInfo.version + "&env=" + this.projectService.getSelectedEnv();
        this.projectService.refreshProjects( this.projectService.getSelectedEnv(), true );
        this.router.navigateByUrl( url );
      }else{
        this.problemsErrors = problemResponse.problems.map(problem => problem.message);
      }
    }, error => {
      this.generalError = "Something went wrong";
    });
  }

}

export class ProjectInfo{
  title:string;
  group:string;
  version:string;
}
