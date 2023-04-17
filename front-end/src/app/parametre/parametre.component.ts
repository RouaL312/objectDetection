import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css']
})
export class ParametreComponent implements OnInit {
  username!:string;
  role!:string;
  constructor(private title: Title,private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.title.setTitle('Paramétre')
    this.username=this.localStorageService.retrieve("login");
    this.role=this.localStorageService.retrieve('authorities');
  }

}
