import { Component, Input, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [ NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent {
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  errorMessage = '';
  // Set the page title
  pageTitle = 'Product Detail'
  private productService = inject(ProductService)

  // Product to display
  product: Product | null = null;
  product$ = this.productService.product2$.pipe(
    tap((product) => this.pageTitle = `Product Detail for: ${product.productName}`),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    }))




  addToCart(product: Product) {
  }
}
