import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectService } from './services/project.service';
import { ProjectClient } from './clients/project.client';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Routes } from './routes';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { FormsModule } from "@angular/forms";
import { NotificationService } from "./services/notification.service";
import { ProjectComponent } from './components/project/project.component';
import { SidebarComponent } from './components/project/sidebar/sidebar.component';
import { ContentComponent } from './components/project/content/content.component';
import { ProjectSettingsComponent } from "./components/project/project-settings/project-settings.component";
import { ProjectDashboardComponent } from './components/projects/project-dashboard/project-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectsComponent,
    CreateProjectComponent,
    ProjectComponent,
    SidebarComponent,
    ContentComponent,
    ProjectSettingsComponent,
    ProjectDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(Routes, {
      useHash: true
    })
  ],
  providers: [
    ProjectClient,
    ProjectService,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
