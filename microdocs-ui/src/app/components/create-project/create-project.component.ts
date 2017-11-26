import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  model: Project = {code: '', name: ''};

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {

  }

}
