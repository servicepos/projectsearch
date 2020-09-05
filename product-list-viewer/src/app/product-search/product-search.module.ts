import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductSearchComponent } from './product-search.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        NgxPaginationModule,
        ReactiveFormsModule
    ],
    declarations: [
        ProductSearchComponent
    ]
})
export class ProductSearchModule { }
