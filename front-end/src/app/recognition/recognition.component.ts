import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { VideoFeedService } from '../shared/service/video-feed.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ShoppingCartService } from '../shared/service/shopping-cart.service';
import { ProductService } from '../shared/service/product.service';

@Component({
  selector: 'app-recognition',
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.scss']
})
export class RecognitionComponent implements OnInit {


  constructor(private videoFeedService: VideoFeedService, private messageService:MessageService,
    private shoppingCartService:ShoppingCartService,private productService:ProductService,private title :Title) {
      title.setTitle('Recognition')
     }
  videoFeedUrl = '';
  imageSrc = '';
  spinner:boolean = false;
  ngOnInit(): void {

  }

  startCameraForObjectDetection(): void {
    this.spinner=true;
    this.imageSrc = 'http://localhost:5000/api/video_feed';
    this.spinner=false;


  }

  addToCart(): void {
    const code_product1 = '4';
    const codeProductNumber1 = parseInt(code_product1);
    console.log(codeProductNumber1); // Output: 4
    // Send a GET request to the server to add an item to the cart
    this.videoFeedService.addToCart().subscribe(data=>{


      console.log('add to cart')
      console.log(data)
      this.messageService.add({severity: 'success', summary: 'Service Message', detail: 'Via MessageService'})
      for ( let i =0; i<data.length;i++){
        const code_product = data[i].code_product;
        const codeProductNumber = parseInt(code_product);
        console.log(code_product); 
        this.productService.getProductByCode(code_product).subscribe(prod=>{
           this.shoppingCartService.addItem(prod, data.quantite);
        })
      }


    })
  }

  removeFromCart(): void {
    // Send a GET request to the server to remove an item from the cart
  }

  checkBill(): void {
    // Navigate to the checkout page
  }

}
