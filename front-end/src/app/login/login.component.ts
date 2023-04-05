import {Router} from "@angular/router";
import {SoundService} from "../shared/service/sound.service";
import {VersionService} from "../shared/service/version.service";
import {LoginPayload} from "../model/loginPayload";
import {Version} from "../model/Version";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AbstractControl,FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/service/auth.service";
import {Role} from "../model/Role";
import {LocalStorageService} from "ngx-webstorage";
import {Title} from "@angular/platform-browser";
import {MessageService} from "primeng/api";
import { Component} from '@angular/core';
import Validation from "../model/Validation";
import { User } from "../model/User";
import {UserService} from "../shared/service/User.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  loginPayload: LoginPayload;
  version!: Version;
  userWithCodepin!: boolean;
  signUp!: boolean;
  userWithPassword!: boolean;
  hide = true;
  hideCode = true;
  codeNumber = '';
  FormateurGroup!: FormGroup;
  angForm!: FormGroup ;
  UserGroup!: FormGroup;
  UserForm!: User;
  password: any;

  //FormControl
  usernameControl = new FormControl('', [
    Validators.required,
  ]);
  passwordControl = new FormControl('', [
    Validators.required,
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
  ]);
  nameControl = new FormControl('', [
    Validators.required,
  ]);
  authoritiesControl = new FormControl('', [
    Validators.required,
  ]);
  prenomControl = new FormControl('', [
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
  private data = '';
  userNameControle = new FormControl({value: this.data, disabled: false});
  passwordControle = new FormControl({value: this.data, disabled: false});

  constructor(private authService: AuthService, private modalService: NgbModal, private router: Router,private fb: FormBuilder,
              private soundService: SoundService, private versionService: VersionService, private title: Title,private userService: UserService,
              private localStorageService: LocalStorageService, private messageService: MessageService) {
   this.registerForm();
    this.title.setTitle('login')
    this.loginPayload = new class implements LoginPayload {
      username: string | undefined;
      password: string | undefined;
    };

  }
  registerForm(){
    this.UserGroup = this.fb.group({
      usernameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      prenomControl: ['', Validators.required],
      passwordControl: ['', Validators.required],
      nameControl: ['', Validators.required],
      genderControl: ['', Validators.required],
      professionControl: ['', Validators.required],
      addressControl: ['', Validators.required],
      authoritiesControl: [false, Validators.required],
      confirmPassword: ['', Validators.required],
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
      authorities: false,
    }
  }
  SignUp(){
    this.signUp=true
  }
  SignIn(){
    this.signUp=false
  }
  ngOnInit(): void {
    this.signUp=false;
    const body = document.querySelector("body");
    const modal = document.querySelector(".modal");
    const closeButton = document.querySelector(".close-button");
    let isOpened = false;
    if(modal && body && !isOpened )
    {
    const openModal = () => {
      modal.classList.add("is-open");
      body.style.overflow = "hidden";
       isOpened = true;
    };
    const closeModal = () => {
      modal.classList.remove("is-open");
      body.style.overflow = "initial";
    };
    setInterval(() => openModal(), 200);

    }
    }
    get f(): { [key: string]: AbstractControl } {
      return this.UserGroup.controls;
    }
  login() {
    this.loginPayload.password = this.passwordControle.value;
    this.loginPayload.username = this.userNameControle.value;
    if(this.loginPayload.username==undefined || this.loginPayload.password==undefined)
    {
      this.messageService.add({severity: 'error', summary: 'Login error', detail: 'Vous devez vérifier votre login'});
    }
    
    if (this.loginPayload.username && this.loginPayload.password) {
      return this.authService.login(this.loginPayload).subscribe(data => {
        if (data != null) {
          this.localStorageService.store('authResponse', data)
          let admin= false ;
            admin = data.is_admin;
            this.messageService.add({severity: 'success', summary: 'Service Message', detail: 'Via MessageService'});
            this.router.navigateByUrl('/admin');
            this.soundService.playAudio('../assets/sounds/intro.wav');

        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Mot de pass error',
            detail: 'Vous devez vérifier votre mot de passe'
          });

        }
      })
    } else {
      this.messageService.add({severity: 'error', summary: 'Service Message', detail: 'Via MessageService'});
      return;
    }
  }

  toggleEye: boolean = true;
  
  toggleEyeIcon(inputPassword:any) {
		this.toggleEye = !this.toggleEye;
		
		inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';

		
	}
  Register() {
    console.log('ggg')
    if (this.UserGroup.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Probléme ajout utilisateur',
        detail: 'Vérifier votre formulaire'
      });
      return;
    }
    this.UserForm.firstName = this.f.nameControl.value;
    this.UserForm.lastName = this.f.prenomControl.value;
    this.UserForm.username = this.f.usernameControl.value;
    this.UserForm.email = this.f.emailControl.value;
    this.UserForm.password = this.f.passwordControl.value;
    this.UserForm.profession = this.f.professionControl.value;
    this.UserForm.address = this.f.addressControl.value;
    this.UserForm.gender = this.f.genderControl.value;
    console.log(this.UserForm);
    this.userService.addUser(this.UserForm).subscribe(data => {
      this.messageService.add({
        severity: 'success',
        summary: 'Ajouter utilisateur',
        detail: 'L\'utilisateur est ajouté avec success'
      });
    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Probléme ajout utilisateur',
        detail: 'Impossible d\'ajouter l\'utilisateur'
      });
    })
  }
}
