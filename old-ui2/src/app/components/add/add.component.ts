import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Project } from "@maxxton/microdocs-core/domain";
import { ProjectService } from "../../services/project.service";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  firstFormGroup: FormGroup;
  definition:Project;
  loading:boolean = false;
  error: string;

  constructor(private _formBuilder: FormBuilder, private projectService: ProjectService, private router: Router) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      definition: ['', Validators.required]
    });
  }

  onDefinitionChanges(event:any){
    let string = event.target.value;
    try{
      this.definition = JSON.parse(string);
      if(!this.definition.info){
        this.definition.info = {};
      }
    }catch(e){}
  }

  getDefinitionTitle(definition:Project):string {
    let string = "";
    if(definition && definition.info){
      if(definition.info.title){
        string += definition.info.title;
        if(definition.info.tag){
          string += ":" + definition.info.tag
        }
      }
    }
    return string;
  }

  publish(definition:Project):void {
    this.loading = true;
    this.error = undefined;
    this.projectService.addProject(definition).subscribe(done => {
      this.loading = false;
      let url = "/projects/" + this.definition.info.title + "/" + this.definition.info.tag + "&env=" + this.projectService.getSelectedEnv();
      this.projectService.refreshProjects( this.projectService.getSelectedEnv(), true );
      this.router.navigateByUrl( url );
    }, error => {
      this.loading = false;
      this.error =  "Something went wrong";
    });
  }

}

