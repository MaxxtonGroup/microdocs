import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
import {COMPONENTS} from "@maxxton/components/components";
import {Project} from "@maxxton/microdocs-core/domain";
import {ProjectService} from "../../services/project.service";

/**
 * @author Steven Hermans
 */
@Component({
  selector: 'import-panel',
  templateUrl: 'import.panel.html',
  directives: [COMPONENTS]
})
export class ImportPanel{
  
  @Input()
  showModal:boolean = false;
  
  @Output()
  stateChanges : EventEmitter = new EventEmitter();
  
  project:Project = null;
  projectInfo:ProjectInfo = new ProjectInfo();
  
  jsonError:string = "";
  generalError:string = "";
  valid:boolean = false;
  projectDefinition:string = '';
  
  constructor(private projectService:ProjectService, private router:Router){}
  
  public setOpened(state:boolean){
    this.showModal = state;
    this.stateChanges.emit(state);
    if(!state){
      this.projectDefinition = '';
      this.project = null;
      this.projectInfo = new ProjectInfo();
    }
  }
  
  onProjectInserted($event){
    this.projectDefinition = $event.target.value;
    this.jsonError = "";
    try{
      this.project = JSON.parse(this.projectDefinition);
    }catch(e){
      this.valid = false;
      this.jsonError = "Invalid json";
      return;
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
  
    this.projectService.importProject(this.project, this.projectInfo.title, this.projectInfo.group, this.projectInfo.version).subscribe(resp => {
      var url = "/projects/" + this.projectInfo.group + "/" + this.projectInfo.title + "?version=" + this.projectInfo.version + "&env=" + this.projectService.getSelectedEnv();
      this.setOpened(false);
      this.projectService.refreshProjects(this.projectService.getSelectedEnv(), true);
      this.router.navigateByUrl(url);
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