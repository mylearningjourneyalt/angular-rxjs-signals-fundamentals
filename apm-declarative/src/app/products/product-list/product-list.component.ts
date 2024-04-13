import { Component, inject } from '@angular/core';

import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';

  //Product Service
  private productService = inject(ProductService)

  // Products
  readonly products$ = this.productService.products$.pipe(tap(() => console.log('In component pipeline')), catchError(err => {
    this.errorMessage = err;
    return EMPTY
  }))

  // Selected product id to highlight the entry
  readonly selectedProductId$ = this.productService.productSelected$

  onSelected(productId: number): void {
    this.productService.productSelected(productId)

  }
}
