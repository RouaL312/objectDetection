import { Injectable } from '@angular/core';
import { Product } from '../../model/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { Byte } from '@angular/compiler/src/util';
import { AjoutResponse } from 'src/app/model/AjoutResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

  constructor(private http : HttpClient) { }

  private baseUrl = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getProductsSmall() {
    return this.http.get<any>('assets/products-small.json')
      .toPromise()
      .then(res => <Product[]>res.data)
      .then(data => { return data; });
  }

  getProducts(): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl + '/api/product/getAllProduct'}`, this.httpOptions)
      .pipe(retry(1),
        catchError(this.handleError))
  }
  saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl + '/api/product/saveProduct', product,  this.httpOptions );
  }

  getProductsWithOrdersSmall() {
    return this.http.get<any>('assets/products-orders-small.json')
      .toPromise()
      .then(res => <Product[]>res.data)
      .then(data => { return data; });
  }
  getImageProduct(idProduct: number): Observable<Byte> {
    return this.http.get<Byte>(`${this.baseUrl + '/api/product/upload'}?idProduct=${idProduct}`);
  }
  
  deleteProduct(id: number ): Observable<AjoutResponse> {
    return this.http.post<AjoutResponse>(this.baseUrl + '/api/product/deleteProduct', JSON.stringify(id), this.httpOptions)
      .pipe(retry(1),
      catchError(this.handleError))
  }
  getProductById(fk_product: Number ): Observable<Product> {
    console.log(fk_product)
    return this.http.get<Product>(`${this.baseUrl + '/api/product/productById'}?fk_product=${fk_product}`)
      .pipe(retry(1),
      catchError(this.handleError))
  }

  generateId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  generatePrice() {
    return Math.floor(Math.random() * Math.floor(299) + 1);
  }

  generateQuantity() {
    return Math.floor(Math.random() * Math.floor(75) + 1);
  }

  generateStatus() {
    return this.status[Math.floor(Math.random() * Math.floor(3))];
  }

  generateRating() {
    return Math.floor(Math.random() * Math.floor(5) + 1);
  }
  // Error handling
  handleError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
