import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, flatMap, map, shareReplay, tap } from 'rxjs/operators';
import { IProduct } from '../models/products';
import { ProductService } from '../services/product-service/product.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  filterString$ = new ReplaySubject<string>(1);
  products$: Observable<IProduct[]>;

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.filterString$.pipe(
      debounceTime(150),
      shareReplay(1),
      distinctUntilChanged(),
      flatMap(() => this.productService.getProducts())
    );
  }
}
