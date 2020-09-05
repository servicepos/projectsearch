import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from "../data/product"

@Injectable({ providedIn: 'root' })
export class ProductService {

    private productUrl = './assets/products.json';  
    private dataStored: Product[];
    private observedProducts: Observable<Product[]>;

    constructor(private _httpClient: HttpClient) { }

    /*  If there is no search term (ie. emtpy input) then we return an empty array. 
        If data is already available then we just return it back again as an Observable.
        If the observable is already set then a request in process and we return that ongoing request.
        If none above, we create the request, store the data for new subscribers.
        When data is cached we dont need our observale reference anymore. */
    getAllProductsBasedOnSearch(searchValue: string = null, page: number = 1, limit: number = 10) {
        if (!searchValue.trim()) {
            console.log('Search was empty');
            return of([]);
        }

        if(this.dataStored) {
            console.log('Data is already available!');
            return of(this.dataStored.filter(p => p.title.toLowerCase().includes(searchValue.toLowerCase()))); 
        } else if(this.observedProducts) {
            console.log('A request is already pending');
            return this.observedProducts;
        } else {
            console.log('Sending a new request');
            this.observedProducts = this._httpClient.get(this.productUrl).pipe(map(data =>  {
                this.observedProducts = null;
                this.dataStored = data["content"];
                return this.dataStored.filter(p => p.title.toLowerCase().includes(searchValue.toLowerCase()));
            }));
            return this.observedProducts;
        }
    }
}
