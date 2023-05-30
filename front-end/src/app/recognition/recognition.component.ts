import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { VideoFeedService } from '../shared/service/video-feed.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ShoppingCartService } from '../shared/service/shopping-cart.service';
import { ProductService } from '../shared/service/product.service';
import { Product } from '../model/product';
import { FileUploadService } from '../shared/service/file-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recognition',
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.scss']
})
export class RecognitionComponent implements OnInit {
  recognitionStart: any;
  cards!: {product: Product, quantity: number}[] ;
  imageProduct: any;
  previews: any;
  i: any
  visible!: true;
  position!: string;
  videoFeedUrl = '';
  imageSrc = '';
  spinner:boolean = false;
  showDialog(position: string) {
      this.position = position;
      this.visible = true;
  }  
  productsImages: any[] = [];
  constructor(private videoFeedService: VideoFeedService, private messageService:MessageService,
    private confirmationService:ConfirmationService,private router: Router, 
    private shoppingCartService:ShoppingCartService,private productService:ProductService,private title :Title,public sanitizer:DomSanitizer
    ,private uploadService:FileUploadService) {
      title.setTitle('Recognition')
     }

  ngOnInit(): void {
    this.showDialog('right');
    this.cards=this.shoppingCartService.getItems()
    console.log(this.cards)
    this.startCameraForObjectDetection().then(() => {
      this.recognitionStart = setInterval(() => {
        this.addToCart()
        this.cards=this.shoppingCartService.getItems()
        for (this.i = 0; this.i < this.cards.length; this.i++) {
          this.getImageProduct(this.i)
        }
      }, 1000);
    });

  }
  getImageProduct(product: Product) {
    if (product.id != null && product.url_image_prod != null) {
      return this.uploadService.getImage(product.id).subscribe((data: Blob) => {
        this.imageProduct = data
        this.createImageFromBlob(data,product);
      }, (error: any) => {
        this.previews = null
        product.previews=this.previews
      });
    } else {
      this.previews = null
      product.previews=this.previews
      return;
    }
  }
  createImageFromBlob(image: Blob,product :Product) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.previews = reader.result;
      product.previews=this.previews
      reader.onload = (e: any) => {
        this.previews = e.target.result;
        product.previews=this.previews

      };
    }, false);
    if (image) {
      reader.readAsDataURL(image);

    }

}
  startCameraForObjectDetection() {
    return new Promise<void>((resolve) => {
      this.spinner=true;
      this.imageSrc = 'http://localhost:5000/api/video_feed';
    this.spinner=false;
      setTimeout(() => {
        console.log('La fonction 1 est terminée');
        resolve();
      }, 3000);
    });
  }

  addToCart(): void {
    // Send a GET request to the server to add an item to the cart
    this.videoFeedService.addToCart().subscribe(data=>{

      this.messageService.add({severity: 'success', summary: 'Product added', detail: 'product added to cart successfully'})
      this.visible = true;
      for ( let i =0; i<data.length;i++){
        this.productService.getProductById(data[i].fk_product).subscribe(prod=>{
           this.shoppingCartService.addItem(prod, data.quantite);
        })
      }
    })

  }
  getSeverity(status: string):any {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
    }
}
  removeFromCart(): void {
    // Send a GET request to the server to remove an item from the cart
  }

  checkBill(): void {
    // Navigate to the checkout page
  }
  ngOnDestroy() {
    clearInterval(this.recognitionStart);
  }
  ConfirmCommande() {
    this.confirmationService.confirm({
     message: 'Do you want to Confirm your order?',
     header: 'Delete Confirmation',
     icon: 'pi pi-exclamation-triangle',
     accept: () => {
 
       this.shoppingCartService.saveCommande(this.cards).subscribe(data => {
         this.messageService.add({severity: 'success', summary: 'Successful', detail: data.message, life: 1000});
         this.router.navigateByUrl('/admin/orders');
           this.cards=[]
           }, (error: any) => {
             this.messageService.add({severity: 'error', summary: 'Probléme de Validation', detail: error.message});
           });
     }
   });
 }
 deleteLigne(index: number) {
  this.cards.splice(index,1)
}
}
