

import { Route } from '@angular/router';
import { ProjectsComponent } from '../components/projects/projects.component';

export const Routes: Route[] = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: ProjectsComponent
  }
];
