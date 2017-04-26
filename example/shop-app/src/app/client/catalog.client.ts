import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { Product } from "../domain/product";
import { RestClient, HttpClient, Get, Produces, MediaType, Client } from "@maxxton/angular-rest";

@Client({
  serviceId: 'catalog-service'
})
@Injectable()
export class CatalogClient extends RestClient {

  constructor(private http:Http){
    super(<any>http);
  }

  @Get('/api/v1/catalog')
  @Produces(MediaType.JSON)
  public getProducts():Observable<Product[]>{
    return null;
  }

}
