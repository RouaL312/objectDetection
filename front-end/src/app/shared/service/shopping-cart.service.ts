import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { Product } from 'src/app/model/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private cards: {product: Product, quantity: number}[] = [];

  constructor(private http : HttpClient, private localStorageService:LocalStorageService) { }

  private baseUrl = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  addItem(product: Product, quantity: number = 1) {
    console.log(product)
    const index = this.cards.findIndex(i => i.product.id === product.id);
    if (index >= 0) {
      this.cards[index].quantity += quantity;
    } else {
      this.cards.push({product, quantity});
    }
  }

  getItems() {
    return this.cards;
  }

  clearCart() {
    this.cards = [];
    return this.cards;
  }
  user!:string
  
  saveCommande(cards: { product: Product; quantity: number}[]):Observable<any> {
    console.log(cards)
    const user = this.localStorageService.retrieve('login');
    const cardsWithUser = cards.map(card => ({ ...card, user }));
    console.log(cardsWithUser)
    return this.http.post(this.baseUrl + '/api/commande/saveCommande', cardsWithUser,  this.httpOptions );
  }
}
