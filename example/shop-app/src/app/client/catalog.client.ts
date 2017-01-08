import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { Product } from "../domain/product";

@Injectable()
export class CatalogClient {

  constructor(private http:Http){

  }

  public getProducts():Observable<Product[]>{
    return this.http.get('http://catalog-service/api/v1/products')
          .map(response => <Product[]>response.json());
  }

}
