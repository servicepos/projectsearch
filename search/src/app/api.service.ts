import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product, SearchProductResponse} from '../assets/products';
import {map, shareReplay} from 'rxjs/operators';

// import productsData from '../../../products.json';
// import {Product, SearchProductResponse} from '../assets/products';
// const AllProducts: Product[] = (productsData as SearchProductResponse).content;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private cache$: Observable<Product[]>;

  constructor(private http: HttpClient) {}

  get products(): Observable<Product[]> {
    // return AllProducts;
    if (!this.cache$) {
      this.cache$ = this.loadProducts().pipe(
        shareReplay()
      );
    }

    return this.cache$;
  }

  private loadProducts(): Observable<Product[]> {
    return this.http
      .get<SearchProductResponse>('../assets/products.json')
      .pipe(
        map(v => {
          // binary search preparation
          v.content.sort((a, b) => {
            const va = a.title.toLowerCase();
            const vb = b.title.toLowerCase();
            // TODO: deal with special situations of unicode?

            if (va > vb) {
              return 1;
            } else if (va < vb) {
              return -1;
            } else { return 0; }
          });
          return v.content;
        })
      );
  }

}
