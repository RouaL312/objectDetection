import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private modalService: NgbModal,private title :Title) {
    this.title.setTitle('Products')
  }
  
  imageSrc = 'assets/images/product/1.jpg';
  
  sizeClass = "";

  ngOnInit(): void {
  }
  
  onClick(imagename:any) {
    this.imageSrc = "assets/images/product/"+imagename;
  }
  
	open(content:any) {
		this.modalService.open(content);
	}
    
    toggleSizeClass(size:any) {
        this.sizeClass = size;
    }

}
