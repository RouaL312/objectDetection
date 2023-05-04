import { Injectable } from '@angular/core';
import { Product } from 'src/app/model/product';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cards: {product: Product, quantity: number}[] = [];


  constructor() { }
  addItem(product: Product, quantity: number = 1) {
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
}
