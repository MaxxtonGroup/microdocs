import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Product } from "../../domain/product";
import { CatalogService } from "../../service/catalog.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  error:string;
  loading:boolean = true;
  products:Observable<Product[]>;

  constructor(catalogService:CatalogService) {
    this.products = catalogService.getProducts();
    this.products.subscribe(products => {
      this.loading = true;
    }, error => {
      this.error = "Unable to load the Product Catalog";
      console.error(error);
    });
  }

  ngOnInit() {
  }

}
