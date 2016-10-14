import {Component, EventEmitter, Output, Input} from "@angular/core";
import {COMPONENTS} from "@maxxton/components/components";
import {ProjectService} from "../../services/project.service";

/**
 * @author Steven Hermans
 */
@Component({
  selector: 'export-panel',
  templateUrl: 'export.panel.html',
  directives: [COMPONENTS]
})
export class ExportPanel {
  
  @Input()
  showModal:boolean = false;
  
  @Output()
  stateChanges : EventEmitter = new EventEmitter();
  
  constructor(private projectService:ProjectServicee){
    
  }
  
  public setOpened(state:boolean){
    this.showModal = state;
    this.stateChanges.emit(state);
    if(!state){
      
    }
  }
  
}