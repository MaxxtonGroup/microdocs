import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { Product } from "../domain/product";
import { RestClient, HttpClient, Get, Produces, MediaType } from "@maxxton/angular-rest";

@Injectable()
export class CatalogClient extends RestClient {

  constructor(private http:Http){
    super(<HttpClient>http);
  }

  @Get('http://catalog-service/api/v1/products')
  @Produces(MediaType.JSON)
  public getProducts():Observable<Product[]>{
    return null;
  }

}
