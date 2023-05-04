import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, } from '@angular/core';
import { Product } from '../model/product';
import { SelectItem } from 'primeng/api/selectitem';
import { ProductService } from '../shared/service/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploadService } from '../shared/service/file-upload.service';
import { MessageService } from 'primeng/api';
import { ShoppingCartService } from '../shared/service/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  
  products: Product[] | any;
  sortOptions: SelectItem[] | any;
  sortOrder: number | any;
  sortField: string | any;
  inputValue: any;
  imageProduct: any;
  previews: any;
  i: any
  productsImages: any[] = [];
  quantity: number = 0;

  constructor(private productService: ProductService, private modalService: NgbModal, public sanitizer: DomSanitizer, private renderer: Renderer2, private elementRef: ElementRef,
    private uploadService: FileUploadService, public messageService: MessageService, public shoppingCartService: ShoppingCartService) {
  }


  open(content: any) {
    this.modalService.open(content);
  }
  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data
      for (this.i = 0; this.i < this.products.length; this.i++) {
        this.getImageProduct(this.products[this.i])
      }
    }
    );


    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];

  }
  ngAfterViewInit() {
    const quantityEl = this.elementRef.nativeElement.querySelector('#quantity');
    if (quantityEl) {
      this.renderer.setProperty(quantityEl, 'value', 42);
    }
  }
  filtre(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.inputValue = inputElement.value;
  }
  onSortChange(event: { value: any; }) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
  getImageProduct(product: Product) {
    if (product.id != null && product.url_image_prod != null) {
      return this.uploadService.getImage(product.id).subscribe((data: Blob) => {
        this.imageProduct = data
        this.createImageFromBlob(data, product);
      }, (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Image problem', detail: 'Product image is missing' });
        this.previews = null
        product.previews = this.previews
      });
    } else {
      this.previews = null
      product.previews = this.previews
      return;
    }
  }
  createImageFromBlob(image: Blob, product: Product) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.previews = reader.result;
      product.previews = this.previews
      reader.onload = (e: any) => {
        this.previews = e.target.result;
        product.previews = this.previews

      };
    }, false);
    if (image) {
      reader.readAsDataURL(image);

    }

  }
  addToCart(item: Product, quantity: number) {
    this.shoppingCartService.addItem(item, quantity);
  }
}