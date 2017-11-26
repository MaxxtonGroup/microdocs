import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  projects: Project[];

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    this.subscription = this.projectService.getProjects().subscribe(projects => this.projects = projects);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteProject(projectCode: string) {

  }

}
