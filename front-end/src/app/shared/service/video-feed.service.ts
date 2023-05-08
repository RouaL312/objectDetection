import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Observable, throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class VideoFeedService {

  private baseUrl = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private http: HttpClient) {}

  getVideoFeedUrl(): Observable<any>{
    return this.http.options(this.baseUrl + '/api/video_feed',{ responseType: 'blob' });
  }
  addToCart(): Observable<any> {
    return this.http.get(this.baseUrl + '/api/add_to_cart');
  }
}
