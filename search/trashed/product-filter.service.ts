import {Injectable} from '@angular/core';
import productsData from '../../products.json';
import {Product, SearchProductResponse} from '../src/assets/products';
const AllProducts: Product[] = (productsData as SearchProductResponse).content;
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const AllProducts: Product[] = (productsData as SearchProductResponse).content;


@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    // return AllProducts;
    return this.http.get('../asses/products.json');
  }
}
