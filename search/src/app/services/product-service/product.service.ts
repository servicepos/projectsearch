import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IProduct, ISearchProductResponse } from 'src/app/models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly productsUrl = 'assets/products.json';

  private products$: Observable<IProduct[]>;

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<IProduct[]> {
    if (!this.products$) {
      this.products$ = this.http.get<ISearchProductResponse>(this.productsUrl)
        .pipe(
          map(x => x.content),
          catchError(this.handleError<IProduct[]>('getProducts', []))
        );
    }

    return this.products$;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
