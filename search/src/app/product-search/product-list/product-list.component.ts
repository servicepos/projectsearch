import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { IProduct } from 'src/app/models/products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() filterString$: ReplaySubject<string>;
  @Input() products$: Observable<IProduct[]>;

  displayedColumns: string[] = ['title', 'brand', 'price', 'productno'];
  dataSource: MatTableDataSource<IProduct>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.products$.pipe(take(1)).subscribe(products => {
      this.initializeDataSource(products);
      this.filterString$.subscribe(filterString => this.applyFilter(filterString));
    });
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private initializeDataSource(products: IProduct[]) {
    this.dataSource = new MatTableDataSource(products);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
