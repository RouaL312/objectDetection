import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CheckBillService {

  private baseUrl = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  getCommandeVenteWithLigneCommande(): Observable<any> {
    return this.http.get(this.baseUrl +'/api/commande_vente');
  }
}