import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from "../../shared/service/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {LocalStorageService} from "ngx-webstorage";
import { ShoppingCartService } from 'src/app/shared/service/shopping-cart.service';
import { Product } from 'src/app/model/product';
import { FileUploadService } from 'src/app/shared/service/file-upload.service';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
	providers: [NgbDropdownConfig]
})
export class HeaderComponent implements OnInit {


	toggleChat: boolean = true;
	toggleSingle: boolean = true;
  username!: string;
  role!:string;
  cards!: {product: Product, quantity: number}[] ;
  imageProduct: any;
  previews: any;
  i: any
  productsImages: any[] = [];
	constructor(private authService: AuthService, private router: Router, public sanitizer: DomSanitizer, private uploadService: FileUploadService,
              public title: Title, private localStorageService: LocalStorageService , 
              private shoppingCartService:ShoppingCartService,private messageService:MessageService,
              private confirmationService:ConfirmationService) { }
  ngOnInit(): void {
    // @ts-ignore
    this.username = this.localStorageService.retrieve("login");
    if(this.localStorageService.retrieve('authorities'))
     {
      this.role='Admin'
     }else{
      this.role='Client'
     }
     this.cards=this.shoppingCartService.getItems()
      for (this.i = 0; this.i < this.cards.length; this.i++) {
        this.getImageProduct(this.i)
      }
   
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
  logout() {
        this.localStorageService.clear();
        this.authService.token = null;
        this.router.navigateByUrl('/login');
   
  }

	togglechatbar() {
		this.toggleChat = !this.toggleChat;
	}
	singleChatWindow() {
		this.toggleSingle = !this.toggleSingle;
	}

  deleteLigne(index: number) {
    this.cards.splice(index,1)
  }
}

var stringToHTML = function (str: string) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, 'text/html');
  return doc.body;
};

