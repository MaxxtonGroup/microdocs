import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { ProjectClient } from '../clients/project.client';

@Injectable()
export class ProjectService {

  private projectStream: ReplaySubject<Project[]>;

  constructor(private projectClient: ProjectClient) {
  }

  public getProjects(): Observable<Project[]> {
    if (!this.projectStream) {
      this.projectStream = new ReplaySubject();
      this.refreshProjects();
    }
    return this.projectStream.asObservable();
  }

  public getProject(projectCode: string): Observable<Project> {
    return this.getProjects()
      .map(projects => projects.filter(project => project.code === projectCode)[0])
      .filter(project => project !== undefined);
  }

  public refreshProjects(): void {
    this.projectClient.getProjects().subscribe(projects => this.projectStream.next(projects), err => console.error(err));
  }

}
