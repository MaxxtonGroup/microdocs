import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CatalogComponent } from './component/catalog/catalog.component';
import { OrderComponent } from './component/order/order.component';
import { CatalogService } from "./service/catalog.service";
import { CatalogClient } from "./client/catalog.client";

const appRoutes: Routes = [
  { path: 'catalog', component: CatalogComponent },
  { path: 'order/:id',      component: OrderComponent },
  { path: '',
    redirectTo: '/catalog',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    CatalogService,
    CatalogClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
