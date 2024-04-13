import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Just enough here for the code to compile
  private productsUrl = 'api/products';

  //For constructor to treat http parameter as part of dependency inject we use private
  // constructor(private http: HttpClient){}
  //NEW WAY 

  private http = inject(HttpClient);
  private httpErrorService = inject(HttpErrorService)
  private reviewService = inject(ReviewService)

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap(res => console.log(res, 'In http.get pipeline')),
      catchError(err => {
        console.error(err);
        return this.handleError(err)
      })
    )
  }

  readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap(res => console.log(res, 'In http.get pipeline')),
    catchError(err => {
      console.error(err);
      return this.handleError(err)
    })
  )




  //Any Observable that emits an observable is call a Higher-order observable
  //When you want to modify an the result from an htpp request by/with the result from another http request use Higher Order Mapping Operators
  //This will subscribe/unsubscribe as well as unwrap the result (not returning an observable but actual result)


  getProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl).pipe(
      tap(() => console.log('In http.get single product pipeline')),
      switchMap(product => this.getProductWithReview(product)),//transformation operator!!! just like map, concatMap, mergeMap
      catchError(err => {
        return this.handleError(err)
      })
    )
  }

  private getProductWithReview(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id)).pipe(
        map(reviews => ({ ...product, reviews })
        )
      )
    }
    return of(product);
  }

  //Test Errors by messing with URL
  private handleError(err: HttpErrorResponse): Observable<never> {
    //never: an Observable that does not emit anything and does not complete
    //this way the http request returns an Observable

    const formattedMessage = this.httpErrorService.formatError(err);
    //creates a replace observable so when you subscription
    //emits error notification and error message
    return throwError(() => formattedMessage);
    // throw formattedMessage;

  }

}
