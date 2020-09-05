import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable  } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Product, ProductService } from '../core'
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-product-search',
    templateUrl: './product-search.component.html',
    styleUrls: ['./product-search.component.scss'],
    
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSearchComponent implements OnInit {
    public productList$: Observable<Product[]>;
    public searchInput: FormControl = new FormControl();
    public page: number = 1;
    public selectedFilter: string;

    constructor(private productService: ProductService) { }
    
    /*  To avoid excessive CPU load, https requests ect. we pipe the search values OnInit combined with RxHS operators.
        Debouncing for 300ms (150 seems alittle low) at each input event before actually using the value. 
        Ignoring the value if it is the same as last time.
        And switching to a new search obserable when the value changes. */
    ngOnInit(): void {
        this.productList$ = this.searchInput.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((value: string) => this.productService.getAllProductsBasedOnSearch(value)),
        );
    }
}
