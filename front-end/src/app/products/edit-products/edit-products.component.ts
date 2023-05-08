import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/shared/service/product.service';
import { DomSanitizer, Title } from "@angular/platform-browser";
import { FileUploadService } from 'src/app/shared/service/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
  styleUrls: ['./edit-products.component.scss']
})
export class EditProductsComponent implements OnInit {
  productDialog: boolean | any;

  products!: Product[] | any;

  product: Product | any;

  selectedProducts: Product[] | any;

  submitted: boolean | any;

  inputValue: any;

  selectedFiles?: FileList;

  selectedFileNames: string[] = []

  previews!: string | ArrayBuffer | null;

  message: string[] = [];

  imageProduct: any;

  disableCode !:boolean;

  status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];
  i: any
  constructor(private productService: ProductService, private messageService: MessageService,
    private confirmationService: ConfirmationService, public sanitizer: DomSanitizer, private uploadService: FileUploadService, private title :Title) { 
      title.setTitle('Products')}

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data
      for (this.i = 0; this.i < this.products.length; this.i++) {
        this.getImageProduct(this.products[this.i])
      }
    }
    );
  }
  filterGlobal(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.inputValue = inputElement.value;
  }
  openNew() {
    this.previews=null;
    this.product = {};
    this.disableCode=false;
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.products != undefined && this.product) {
          this.products = this.products.filter((val: { id: number }) => !this.selectedProducts.includes(val));
          this.selectedProducts = [];
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        }
      }
    });


  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
    this.disableCode=true;
    this.getImageProduct(product);

  }
  getImageProduct(product: Product) {
    if (product.id != null && product.url_image_prod!=null) {
      return this.uploadService.getImage(product.id).subscribe(data => {
        this.imageProduct = data
        this.createImageFromBlob(data,product);
      }, error => {
        this.messageService.add({severity: 'error', summary: 'Image problem', detail:'Product image is missing'});
        this.previews=null
        product.previews=this.previews
      });
    } else {
      this.previews=null
      return;
    }
  }
  createImageFromBlob(image: Blob,product:Product) {
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
  selectFiles(event: any,product:Product): void {
    this.message = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
    this.previews = "";
    if (this.selectedFiles && this.selectedFiles[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previews = e.target.result;
      };
      reader.readAsDataURL(this.selectedFiles[0]);
      this.selectedFileNames.push(this.selectedFiles[0].name);
      product.url_image_prod=this.selectedFiles[0].name
    }
  }
  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.products = this.products.filter((val: Product) => val.id !== product.id);
          this.product = {};
          this.productService.deleteProduct(product.id).subscribe(data => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
          })
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.previews = null;
  }

  saveProduct(product:Product) {
    this.submitted = true;
    if (this.product && this.products && this.product.name) {
      if (this.product.name.trim()) {
        if (this.product.id) {
          this.products[this.findIndexById(this.product.id)] = this.product;
          this.productService.saveProduct(this.product).subscribe(data => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            if(product.url_image_prod!=null)
            {
              this.confirmationService.confirm({
                message: 'Would you like to save the image?',
                icon: 'pi pi-exclamation-triangle text-warning',
                acceptLabel:'Yes',
                acceptIcon: 'pi pi-check',
                acceptButtonStyleClass: 'p-button-warning',
                rejectLabel: 'No',
                rejectIcon: 'pi pi-times',
                rejectButtonStyleClass: 'p-button-secondary',
                accept: () => {
                  this.uploadFiles(data)
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'The photo was downloaded successfully.', life: 3000 });
                },
              });
            }
          }, error => {
          });
          this.productService.getProducts().subscribe(data => {
            this.products=data
          })
          this.products = [...this.products];
          this.productDialog = false;
          this.previews = null;
          this.product = {}; 
        }
        else {
          this.productService.saveProduct(this.product).subscribe(data => {

            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Created', life: 3000 });
            if(product.url_image_prod!=null)
            {
              this.confirmationService.confirm({
                message: 'Would you like to save the image?',
                icon: 'pi pi-exclamation-triangle text-warning',
                acceptLabel:'Oui',
                acceptIcon: 'pi pi-check',
                acceptButtonStyleClass: 'p-button-warning',
                rejectLabel: 'Non',
                rejectIcon: 'pi pi-times',
                rejectButtonStyleClass: 'p-button-secondary',
                accept: () => {
                  this.uploadFiles(data)
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'The photo was downloaded successfully.', life: 3000 });
                },
              });
            }
            
            this.products = [...this.products];
            this.productDialog = false;
            this.previews = null;
            this.product = {}; 
          }, error => {
            this.messageService.add({severity: 'error', summary: 'Image problem', detail:error});
          });


        }

      }

    }
  }
  uploadFiles(product: Product): void {
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i],product);
      }
    }
  }
  upload(idx: number, file: File,product:Product): void {
    if (file && product) {
      this.uploadService.upload(file,product).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
          }
        },
        (err: any) => {
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        });
    }
  }
  findIndexById(id: string): number {
    let index = -1;
    if (this.products) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }
    }

    return index;
  }
}

