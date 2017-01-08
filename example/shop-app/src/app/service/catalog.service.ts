import { Injectable } from '@angular/core';
import { Subject, Observable, ReplaySubject } from "rxjs";
import { Product } from "../domain/product";
import { CatalogClient } from "../client/catalog.client";

@Injectable()
export class CatalogService {

  private products:Subject<Product[]> = new ReplaySubject(1);

  constructor(private catalogClient:CatalogClient) {
  }

  public getProducts():Observable<Product[]> {
    this.catalogClient.getProducts().subscribe(products => {
      this.products.next(products);
    }, error => {
      this.products.error(error);
    });
    return this.products;
  }
}
