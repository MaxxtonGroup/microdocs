import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectService } from "../../services/project.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  model: Project = {code: '', name: ''};

  constructor(private projectService: ProjectService, private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.model.code = this.model.name.replace(/[- _]/g, '').toLowerCase();
    this.projectService.createProject(this.model).subscribe(project => {
      this.router.navigate(['/projects/' + project.code]);
    });
  }

}
