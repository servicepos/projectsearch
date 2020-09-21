import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../assets/products';
import {ApiService} from '../api.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

import {fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

export interface Search {
  raw: string;
  query: string;
  tags: string[];
  sort: string;
}

export interface SearchInputs {
  query: string;
  tags: string[];
}

export interface ValWrapper {
  val: string;
}

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit, AfterViewInit {
  currency = 'dkk';
  products$: Observable<Product[]>;
  results: Product[] = [];
  page: Product[] = [];
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  searchData: Search = {
    raw: '',
    query: '',
    tags: [],
    sort: '',
  };
  tagsref: Map<string, Product[]> = new Map();

  once = (() => {
    let executed = false;
    return (fn) => {
      if (!executed) {
        executed = true;
        fn();
      }
    };
  })();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild('input', {static: false}) input: ElementRef;
  @ViewChild('sorter', {static: false}) select: ElementRef;

  constructor(private api: ApiService) {}

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        distinctUntilChanged(),
        debounceTime(150),
        switchMap(_ => {
          return this.products$;
        })
      )
      .subscribe(products => {

        this.once(() => {
          // -- The search should be freetext. The user should find "SRAM Power Pack PG-1050" be typing "Power SRAM"
          //
          // split each product title, and inject it into a map
          // then take the union for each query word and find the intersection of related products
          for (const product of products) {
            const tags = product.title.toLowerCase().split(' ');
            for (const tag of tags) {
              if (!this.tagsref.has(tag)) {
                this.tagsref.set(tag, []);
              }
              this.tagsref.get(tag).push(product);
            }
          }
        });

        this.modelChanged(products);
        this.updatePage();
      });
  }

  ngOnInit(): void {
    this.products$ = this.api.products;
  }

  sort(attr: string): void {
    const val = (p: Product, focus: string): any => {
      switch (focus) {
        case 'name':
          return p.title.toLowerCase();
        case 'price':
          return p.price;
      }
      console.log('FAILED SWITCH', attr);
    };

    this.results.sort((a, b) => {
      const va = val(a, attr);
      const vb = val(b, attr);

      if (va > vb) {
        return 1;
      } else if (va < vb) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  updateOrdering(evt): void {
    this.sort(evt.value);
    this.updatePage();
  }

  modelChanged(products: Product[]): void {
    this.searchData.query = this.searchData.raw.trim();

    this.results = this.search(products, this.searchData);
    if (this.searchData.sort.length > 0) {
      this.sort(this.searchData.sort);
    }
  }

  updatePage(evt?: PageEvent): void {
    const page = this.paginator.pageIndex;
    const length = this.paginator.pageSize;
    const offset = page * length;

    this.page = this.results.slice(offset, offset + length);
  }

  search(products: Product[], evt?): Product[] {
    if (this.searchData.raw === '') {
      return products;
    }

    const constraints: SearchInputs = this.searchData;
    const query = constraints.query.toLowerCase().split(' ');

    let refs: Product[] = [];
    for (const tag in query) {
      if (!this.tagsref.has(tag)) {
        continue;
      }

      refs = [...refs, ...this.tagsref.get(tag)];
    }

    // TODO: support weighted heuristics
    // show the "heaviest" items first, as they're a more
    // accurate match than the rest - while remaining a comprehensive
    // search and being forgiving for incorrect keywords
    const productsSet = new Set<Product>();
    refs.forEach(productsSet.add);

    // the last grouping might be partial
    const lastQuery = query.pop();
    if (lastQuery.length > 0) {
      // TODO: binary search
      products
        .filter(p => p.title.toLowerCase().includes(lastQuery))
        .forEach(p => productsSet.add(p));
    }

    return [...productsSet];
  }

  beforeVAT(price: number): number {
    return price / (1 + 0.25);
  }

  profit(price, costprice: number): number {
    return this.beforeVAT(price) - costprice;
  }

  hasProfitInsight(p: Product): boolean {
    return p.price > 0 && p.costprice > 0;
  }

}
