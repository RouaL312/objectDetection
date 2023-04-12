import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements  OnInit {
  navSidebarClass: boolean = true;
  hamburgerClass: boolean = false;
  displayDialog: boolean = false;
  roles!: boolean;
  role!: boolean;

  constructor(private title: Title, private localStorageService: LocalStorageService) {
    this.title.setTitle('Accueil')
  }

  ngOnInit(): void {
    this.roles = this.localStorageService.retrieve('authorities');
    this.role = this.roles;

  }
}

