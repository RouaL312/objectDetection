import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import { Product } from 'src/app/model/product';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private http: HttpClient) { }

    upload(file: File,product: Product): Observable<any> {
      console.log(product)
      const formData: FormData = new FormData();

      formData.append('file', file);
      formData.append('code', product.code);
      const req = new HttpRequest('POST', `${this.baseUrl + '/api/product/upload'}?code=${product.code}`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
      console.log(formData)
      return this.http.post(`${this.baseUrl + '/api/product/upload'}?code=${product.code}`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
  }
  getImage(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl + '/api/product/ImgProduct'}?id=${id}`, { responseType: 'blob' });
  }

}