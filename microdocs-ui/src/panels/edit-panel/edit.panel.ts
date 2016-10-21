import {Component, EventEmitter, Output, Input} from "@angular/core";
import {COMPONENTS} from "@maxxton/components/components";
import {Observable} from "rxjs/Observable";
import {ProjectChangeRule} from "@maxxton/microdocs-core-ts/dist/domain";
import {ProjectService} from "../../services/project.service";
import {Router} from "@angular/router";

/**
 * @author Steven Hermans
 */
@Component({
  selector: 'edit-panel',
  templateUrl: 'edit.panel.html',
  directives: [COMPONENTS]
})
export class EditPanel {
  
  @Input()
  showModal:boolean = false;
  @Input("project")
  project:string = null;
  @Input("version")
  version:string = null;
  @Input("group")
  group:string = null;
  
  @Output()
  stateChanges:EventEmitter = new EventEmitter();
  
  projectInfo:ProjectInfo = new ProjectInfo();
  error:string = '';
  
  constructor(private projectService:ProjectService, private router:Router){}
  
  public setOpened(state:boolean) {
    this.showModal = state;
    this.stateChanges.emit(state);
    if (state) {
      this.error = '';
      this.projectInfo = new ProjectInfo();
    }
  }
  
  setTitle(title:string) {
    if (title === this.project) {
      this.projectInfo.title = undefined;
    } else {
      this.projectInfo.title = title;
    }
  }
  
  setGroup(group:string) {
    if (group === this.group) {
      this.projectInfo.group = undefined;
    } else {
      this.projectInfo.group = group;
    }
  }
  
  setVersion(version:string) {
    if (version === this.version) {
      this.projectInfo.version = undefined;
    } else {
      this.projectInfo.version = version;
    }
  }
  
  toggleTitleScope() {
    if (this.projectInfo.titleScope === 'version') {
      this.projectInfo.titleScope = ProjectChangeRule.SCOPE_PROJECT;
    } else {
      this.projectInfo.titleScope = ProjectChangeRule.SCOPE_VERSION;
    }
  }
  
  toggleGroupScope() {
    if (this.projectInfo.groupScope === 'project') {
      this.projectInfo.groupScope = ProjectChangeRule.SCOPE_GROUP;
    } else {
      this.projectInfo.groupScope = ProjectChangeRule.SCOPE_PROJECT;
    }
  }
  
  onSubmit(){
    if(this.projectInfo.title == ''){
      this.error = "Project name is empty";
    }else if(this.projectInfo.group == ''){
      this.error = "Group is empty";
    }else if(this.projectInfo.version == ''){
      this.error = "Version is empty";
    }else{
      var rules:ProjectChangeRule[] = [];
      var title:string = this.project;
      var group:string = this.group;
      var version:string = this.version;
      if(this.projectInfo.title){
        rules.push(new ProjectChangeRule('info.title', ProjectChangeRule.TYPE_ALTER, this.projectInfo.title, this.projectInfo.titleScope));
        title = this.projectInfo.title;
      }
      if(this.projectInfo.group){
        rules.push(new ProjectChangeRule('info.group', ProjectChangeRule.TYPE_ALTER, this.projectInfo.group, this.projectInfo.groupScope));
        group = this.projectInfo.group;
      }
      if(this.projectInfo.version){
        rules.push(new ProjectChangeRule('info.version', ProjectChangeRule.TYPE_ALTER, this.projectInfo.version, ProjectChangeRule.SCOPE_VERSION));
        version = this.projectInfo.version;
      }
      if(rules.length == 0){
        this.setOpened(false);
      }else {
        this.projectService.updateProject(this.project, rules, this.version).subscribe(res => {
          this.projectService.refreshProjects();
          this.setOpened(false);
          this.router.navigate(['/projects/' + group + '/' + title], {
            queryParams: {
              version: version,
              env: this.projectService.getSelectedEnv()
            }
          });
        }, error => this.error = "Failed to update project");
      }
    }
  }
}

export class ProjectInfo {
  title:string;
  titleScope:string = ProjectChangeRule.SCOPE_PROJECT;
  group:string;
  groupScope:string = ProjectChangeRule.SCOPE_PROJECT;
  version:string;
  
}