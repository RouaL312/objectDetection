import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { format } from 'date-fns';
import { LocalStorageService } from 'ngx-webstorage';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/shared/service/User.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!:User
  constructor(private modalService: NgbModal, private userService:UserService , private localStorageService:LocalStorageService) {}

  ngOnInit(): void {
    this.userService.getUserByLogin(this.localStorageService.retrieve('login')).subscribe(data=>{
      this.user=data
            console.log(this.user)
    })
  
  }
  
	
	open(content:any) {
		this.modalService.open(content);
	}

}
