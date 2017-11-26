import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs/Observable';
import { Client, Get, MediaType, Produces, RestClient } from 'angular-async-http/dist';
import { Http } from '@angular/http';

@Injectable()
@Client({
  baseUrl: 'http://localhost:3000/api/v2',
  headers: {
    'content-type': 'application/json'
  }
})
export class ProjectClient extends RestClient {

  constructor(http: Http) {
    super(http);
  }

  @Get('/projects')
  @Produces(MediaType.JSON)
  public getProjects(): Observable<Project[]> {
    return null;
  }

}
