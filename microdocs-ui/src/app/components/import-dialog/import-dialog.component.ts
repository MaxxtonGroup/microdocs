import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
import { Project, Problem, ProblemResponse, SchemaTypes, ParameterPlacings } from "@maxxton/microdocs-core/domain";
import {ProjectService} from "../../services/project.service";
import { MdDialog, MdSnackBar } from "@angular/material";

declare var JSONEditor;

/**
 * @author Steven Hermans
 */
@Component({
  selector: 'import-dialog',
  templateUrl: 'import-dialog.component.html',
  styleUrls: ['import-dialog.component.scss']
})
export class ImportDialogComponent{

  templateDivRef : any;
  editorRef : any;
  problemsErrors:string[] = [];
  generalError:string;

  constructor(private projectService:ProjectService, private router:Router, private snackbar: MdSnackBar, private dialog: MdDialog){}

  ngAfterViewInit(){
    this.templateDivRef = document.getElementById('jsoneditor');
    this.createDefaultObjectViewer();
  }

  createDefaultObjectViewer(){
    let options = {
      mode: 'code',
      modes: ['code', 'tree'], // allowed modes
      templates: [
        {
          text: 'Path',
          title: 'Insert a new Path',
          className: 'jsoneditor-type-object',
          field: '/api/v1/peanuts',
          value: {
            get: {
              description: '',
              parameters: [
                {
                  name: 'filter',
                  description: '',
                  in: ParameterPlacings.QUERY,
                  type: SchemaTypes.STRING
                }
              ]
            }
          }
        },
      ]
    };
    this.editorRef = new JSONEditor(this.templateDivRef, options, {
      info: {
        title: "awesome-service",
        version: "1.0.0",
        group: "default"
      },
      paths: {
        '/api/v1/peanuts': {
          get: {

          }
        }
      }
    });    //Default Initialization
  }

  onSubmit(){
    this.problemsErrors = [];
    let project:Project = <Project> this.editorRef.get();

    if(!project.info){
      this.generalError = "'info' object is missing";
      return;
    }

    if(!project.info.title || project.info.title.trim() === ""){
      this.generalError = "'info.title' is missing";
      return;
    }
    if(!project.info.group || project.info.group.trim() === ""){
      this.generalError = "'info.group' is missing";
      return;
    }
    if(!project.info.version || project.info.version.trim() === ""){
      this.generalError = "'info.version' is missing";
      return;
    }

    this.projectService.importProject(project, project.info.title, project.info.group, project.info.version).subscribe((problemResponse:ProblemResponse) => {
      if(problemResponse.status === 'ok') {
        this.dialog.closeAll();
        this.snackbar.open( `Added project: ${project.info.title}`, undefined, {duration: 3000} );
        let url = "/projects/" + project.info.title + "?version=" + project.info.version + "&env=" + this.projectService.getSelectedEnv();
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
