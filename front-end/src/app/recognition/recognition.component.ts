import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VideoFeedService } from '../shared/service/video-feed.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-recognition',
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.scss']
})
export class RecognitionComponent implements OnInit {


  constructor(private videoFeedService: VideoFeedService, private messageService:MessageService) { }
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
    // Send a GET request to the server to add an item to the cart
    this.videoFeedService.addToCart().subscribe(data=>{
      console.log('add to cart')
      console.log(data)
      this.messageService.add({severity: 'success', summary: 'Service Message', detail: 'Via MessageService'});

      //this.shoppingCartService.addItem(item, quantity);

    })
  }

  removeFromCart(): void {
    // Send a GET request to the server to remove an item from the cart
  }

  checkBill(): void {
    // Navigate to the checkout page
  }

}
