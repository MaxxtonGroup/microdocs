import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectService } from './services/project.service';
import { ProjectClient } from './clients/project.client';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Routes } from './clients/routes';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectsComponent,
    CreateProjectComponent
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
    ProjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
