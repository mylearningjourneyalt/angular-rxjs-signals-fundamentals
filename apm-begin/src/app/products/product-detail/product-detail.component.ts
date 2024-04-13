import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { EMPTY, Subscription, catchError } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnInit, OnDestroy {
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  errorMessage = '';

  private http = inject(ProductService)

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  sub!: Subscription;
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    const id = changes['productId'].currentValue;
    if (id) {
      this.sub = this.http.getProduct(id).pipe(catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })).subscribe({
        next: (res: Product) => this.product = res,
        complete: () => console.log('Product received, complete')
      })
    }
  }
  ngOnDestroy(): void {
    //Due to subscription in ngOnChanges
    //It is possible that his component is Destroy without ever getting a change
    //By default Prouct is null and the subscription only get set once this component receives an id
    if (this.sub) {
      this.sub.unsubscribe()

    }
  }

  addToCart(product: Product) {
  }
}
