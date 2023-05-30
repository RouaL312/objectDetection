import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../model/User";
import {LocalStorageService} from "ngx-webstorage";
import {UserService} from "../shared/service/User.service";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Validation from "../model/Validation";
import {MatCheckboxChange} from "@angular/material/checkbox";
import { format } from 'date-fns';
import { Title } from '@angular/platform-browser';


let USERS: User[] = [];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']

})
export class UsersComponent implements OnInit {
  hide = true;
  page = 1;
  users!: User[];
  user!: User;
  displayAdd!: boolean;
  displayEdit!: boolean;
  submitted!: boolean;
  UserGroup!: FormGroup;
  UserForm!: User;
  title!: string;
  checked: boolean = false;
  password: any;
  openpopup: boolean = false;
  //FormControl
  usernameControl = new FormControl('', [
    Validators.required,
  ]);
  typeAuthControl = new FormControl('', [
    Validators.required,
  ]);
  passwordControl = new FormControl('', [
    Validators.required,
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,

  ]);
  authoritiesControl = new FormControl(false, [
    Validators.required,
  ]);
  lastNameControl = new FormControl('', [
    Validators.required,
  ]);
  firstNameControl = new FormControl('', [
    Validators.required,
  ]);
  professionControl = new FormControl('', [
    Validators.required,
  ]);
  addressControl = new FormControl('', [
    Validators.required,
  ]);
  genderControl = new FormControl('', [
    Validators.required,
  ]);
  phoneControl = new FormControl('', [
    Validators.required,
  ]);
  codePostal = new FormControl('');
  dateDeNaissance = new FormControl('', [
  ]);
  editPassword!: boolean;
  constructor(private modalService: NgbModal, private userService: UserService, private formBuilder: FormBuilder,
              private localStorageService: LocalStorageService, private confirmationService: ConfirmationService,private messageService: MessageService,private titre :Title) {
                titre.setTitle('Users')
    this.UserGroup = this.formBuilder.group({
      usernameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      lastNameControl: ['', Validators.required],
      passwordControl: ['', Validators.required],
      firstNameControl: ['', Validators.required],
      genderControl: ['', Validators.required],
      professionControl: ['', Validators.required],
      addressControl: ['', Validators.required],
      authoritiesControl: [false, Validators.required],
      phoneControl: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      dateDeNaissanceControl: [Date],
      codePostalsControl: [''],
    }, {
      validators: [Validation.match('passwordControl', 'confirmPassword')]
    });
    this.UserForm = {
      id: undefined,
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      gender:'',
      profession:'',
      address:'',
      phone:'',
      authorities: false,
      codePostal:'',
      dateDeNaissance:''
      
    }
  }


  ngOnInit(): void {
    this.getAllUsers();
  }

  onAffichePWD(ob: MatCheckboxChange) {
    this.checked = ob.checked;
  }

  open(content: any) {
    this.modalService.open(content, {size: 'lg'});
  }

  getAllUsers() {
    return this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      console.log(data);
      USERS = this.users
    })
  }

  // convenience getter for easy access to form fields
  get f(): { [key: string]: AbstractControl } {
    return this.UserGroup.controls;
  }

  changePasswordType() {
    this.f.passwordControl.setValue('');
  }

  editUser(user: User) {

    if (this.openpopup) {
      this.openpopup = false;
      this.openpopup=true;
    } else {
      this.openpopup=true;
    }
    this.title = 'Edit user';
    this.user = {...user};
    this.displayEdit = true;
    this.displayAdd = false;
    this.checked = this.user.authorities;
    this.UserGroup = this.formBuilder.group({
      usernameControl: [this.user.username, Validators.required],
      emailControl: [this.user.email, [Validators.required, Validators.email]],
      lastNameControl: [this.user.lastName, Validators.required],
      passwordControl: ['', Validators.required],
      firstNameControl: [this.user.firstName, Validators.required],
      genderControl: [this.user.gender, Validators.required],
      professionControl: [this.user.profession, Validators.required],
      addressControl: [this.user.address, Validators.required],
      phoneControl: [this.user.phone, Validators.required],
      authoritiesControl: [this.user.authorities, Validators.required],
      confirmPassword: ['', Validators.required],
      codePostalControl: [this.user.codePostal],
      dateDeNaissanceControl:[new Date()],
      
    }, {
      validators: [Validation.match('passwordControl', 'confirmPassword')]
    });
    this.UserGroup.controls['dateDeNaissance'].setValue(this.user.dateDeNaissance); // utilisez la méthode setValue()

  }

  saveEditUser(user: User) {
      this.editPassword=false;
      user.password = this.password;
      this.UserGroup.controls.passwordControl.setValue(user.password)
      this.UserGroup.controls.confirmPassword.setValue(user.password)
    if (this.UserGroup.valid) {
      user.firstName = this.f.firstNameControl.value;
      user.lastName = this.f.lastNameControl.value;
      user.username = this.f.usernameControl.value;
      user.email = this.f.emailControl.value;
      user.address=this.f.addressControl.value;
      user.profession=this.f.professionControl.value;
      user.gender=this.f.genderControl.value;
      user.authorities = this.f.authoritiesControl.value;
      user.phone = this.f.phoneControl.value;
      user.codePostal = this.f.codePostalControl.value;
      user.dateDeNaissance = format(this.f.dateDeNaissanceControl.value, 'dd/MM/yyyy');
      this.displayEdit = true
      this.userService.updateUser(user).subscribe(data => {
        this.messageService.add({
          severity: 'success',
          summary: 'Modifier utilisateur',
          detail: 'L\'utilisateur est modifié avec success'
        });

      }, error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Probléme ajout utilisateur',
          detail: 'Impossible de modifier l\'utilisateur'
        });
      })
      console.log(user)
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Probléme ajout utilisateur',
        detail: 'Vérifier votre données'
      });
      return;
    }
    this.hideDialog();
    this.ngOnInit();
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Do you want to delete the user ?' + user.username + '?',
      header: 'Delete confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (user.id != null) {
          this.userService.deleteUser(user.id).subscribe(data => {
            this.hideDialog();
            this.ngOnInit();
            if (JSON.stringify(data.message == "success")) {
              this.users = this.users.filter(val => val.id !== user.id);

              this.messageService.add({severity: 'success', summary: 'Successful', detail: data.message, life: 1000});
            } else {
              this.messageService.add({severity: 'error', summary: 'Probléme de suppression', detail: data.message});
            }
          })
        }
      }
    });
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.name === o2.name : o2 === o2;
  }

  addUser() {
    this.editPassword=true
    this.displayAdd = true;
    this.displayEdit = false;
    if (this.openpopup) {
      this.openpopup = false;
      this.openpopup=true;
    } else {
      this.openpopup=true;
    }
    this.checked = true;
    this.UserGroup = this.formBuilder.group({
      usernameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      lastNameControl: ['', Validators.required],
      passwordControl: ['', Validators.required],
      firstNameControl: ['', Validators.required],
      genderControl: ['', Validators.required],
      professionControl: ['', Validators.required],
      addressControl: ['', Validators.required],
      authoritiesControl: ['', Validators.required],
      phoneControl: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      codePostalControl: [''],
      dateDeNaissanceControl: [Date],
    }, {
      validators: [Validation.match('passwordControl', 'confirmPassword')]
    });

    this.title = 'Add User';
  }

  saveNewUser() {
    if (this.UserGroup.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Probléme ajout utilisateur',
        detail: 'Vérifier votre formulaire'
      });
      return;
    }
    this.UserForm.firstName = this.f.firstNameControl.value;
    this.UserForm.lastName = this.f.lastNameControl.value;
    this.UserForm.username = this.f.usernameControl.value;
    this.UserForm.email = this.f.emailControl.value;
    this.UserForm.authorities = this.f.authoritiesControl.value;
    this.UserForm.password = this.f.passwordControl.value;
    this.UserForm.profession = this.f.professionControl.value;
    this.UserForm.address = this.f.addressControl.value;
    this.UserForm.gender = this.f.genderControl.value;
    this.UserForm.phone = this.f.phoneControl.value;
    this.UserForm.codePostal = this.f.codePostalControl.value;
    this.UserForm.dateDeNaissance = format(this.f.dateDeNaissanceControl.value, 'dd/MM/yyyy');;
    console.log(this.UserForm);
    this.userService.addUser(this.UserForm).subscribe(data => {
      this.messageService.add({
        severity: 'success',
        summary: 'Add user',
        detail: 'User added successfully'
      });
      this.users = this.users.filter(val => {
        return true;
      });

    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Probléme ajout utilisateur',
        detail: 'Impossible d\'ajouter l\'utilisateur'
      });
    })
    this.hideDialog();
    this.ngOnInit();
  }

  hideDialog() {
    this.openpopup=false;
    this.displayEdit = false;
    this.displayAdd = false;
  }
}
