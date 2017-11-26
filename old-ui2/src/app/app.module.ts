import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import {PrettyJsonModule} from 'angular2-prettyjson';

import { environment } from "../environments/environment";
import { AppComponent } from './app.component';
import { ProjectService } from "./services/project.service";
import { RestProjectClient } from "./clients/rest-project.client";
import { StandaloneProjectClient } from "./clients/standalone-project.client";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import 'hammerjs';
import { SidebarListComponent } from './components/sidebar-list/sidebar-list.component';
import { SortByHttpMethodPipe } from "./pipes/sort-by-http-method.pipe";
import { NotEmptyPipe } from "./pipes/not-empty.pipe";
import { SortByKeyPipe } from "./pipes/sort-by-key.pipe";
import { ObjectIteratorPipe } from "./pipes/object-iterator.pipe";
import { FilterByFieldPipe } from "./pipes/filter-by-field.pipe";
import { EmptyPipe } from "./pipes/empty.pipe";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { IconGeneratorComponent } from './components/icon-generator/icon-generator.component';
import { ProjectComponent } from "./components/project/project.component";
//import { SimpleCardComponent } from './components/simple-card/simple-card.component';
//import { EndpointGroupComponent } from "./components/endpoint-group/endpoint-group.component";
//import { EndpointComponent } from "./components/endpoint/endpoint.component";
//import { PathHighlightComponent } from "./components/path-highlight/path-highlight.component";
//import { ProblemBoxComponent } from "./components/problem-box/problem-box.component";
//import { BodyRenderComponent } from "./components/body-render/body-render.component";
//import { ModelComponent } from "./components/model/model.component";
//import { DependencyGraphComponent } from "./components/dependency-graph/dependency-graph.component";
//import { ImportDialogComponent } from "./components/import-dialog/import-dialog.component";
//import { ExportPanelComponent } from "./components/export-panel/export-panel.component";
//import { DialogBaseComponent } from './components/dialog-base/dialog-base.component';
//import { ExportDialogComponent } from './components/export-dialog/export-dialog.component';
import { WelcomeComponent } from "./components/welcome/welcome.component";
import {
  MdButtonModule,
  MdDialog, MdDialogModule, MdFormFieldControl, MdFormFieldModule, MdIconModule, MdInputModule, MdListModule,
  MdRippleModule,
  MdSidenavModule, MdProgressSpinnerModule,
  MdSnackBarModule, MdStepperModule, MdToolbarModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AddComponent } from './components/add/add.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SidebarListComponent,
    DashboardComponent,
    IconGeneratorComponent,
    ProjectComponent,
//    SimpleCardComponent,
//    EndpointGroupComponent,
//    EndpointComponent,
//    PathHighlightComponent,
//    ProblemBoxComponent,
//    BodyRenderComponent,
//    ModelComponent,
//    DependencyGraphComponent,
    WelcomeComponent,
//    ImportDialogComponent,
//    ExportDialogComponent,
//    DialogBaseComponent,
//    ExportPanelComponent,

    SortByHttpMethodPipe,
    SortByKeyPipe,
    FilterByFieldPipe,
    NotEmptyPipe,
    EmptyPipe,
    ObjectIteratorPipe,
    AddComponent


  ],
  entryComponents: [
//    ImportDialogComponent,
//    ExportPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'add',
        component: AddComponent,
      },
      {
        path: 'projects/:project',
        component: ProjectComponent,
      },
      {
        path: 'projects/:project/:version',
        component: ProjectComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ], {useHash: true}),
    PrettyJsonModule,

    BrowserAnimationsModule,
    MdSidenavModule,
    MdSnackBarModule,
    MdDialogModule,
    MdIconModule,
    MdListModule,
    MdInputModule,
    MdStepperModule,
    MdButtonModule,
    MdProgressSpinnerModule,
    MdToolbarModule
  ],
  providers: [
    ProjectService,
    {provide: 'ProjectClient', useClass: environment.standalone ? StandaloneProjectClient : RestProjectClient }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
