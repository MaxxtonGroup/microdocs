import {Component, Input, Output, EventEmitter} from "@angular/core";
import {COMPONENTS} from "@maxxton/components/components/index";
import {ProjectService} from "../../services/project.service";
import {Router} from "@angular/router";

/**
 * @author Steven Hermans
 */
@Component({
  selector: 'delete-panel',
  templateUrl: 'delete.panel.html',
  directives: [COMPONENTS]
})
export class DeletePanel {
  
  @Input()
  showModal:boolean = false;
  @Input()
  version:string;
  @Input()
  project:string;
  @Output()
  stateChanges:EventEmitter = new EventEmitter();
  
  scope:string;
  error:string;
  
  constructor(private projectService:ProjectService, private router:Router) {
  }
  
  public setOpened(state:boolean) {
    this.showModal = state;
    this.stateChanges.emit(state);
    if (!state) {
      this.scope = undefined;
      this.error = '';
    }
  }
  
  public setScope(scope:string) {
    this.scope = scope;
  }
  
  public doDelete() {
    this.error = '';
    if (this.scope !== 'all' && this.scope !== 'current') {
      this.error = "Select what you want to delete";
    } else {
      this.projectService.deleteProject(this.project, this.scope === 'current' ? this.version : undefined).subscribe(response => {
          this.projectService.refreshProjects();
          this.setOpened(false);
          this.router.navigate(['/dashboard'], {queryParams: {env: this.projectService.getSelectedEnv()}});
        }, (error) => {
          this.error = "Failed to delete project";
        }
      );
    }
  }
  
}