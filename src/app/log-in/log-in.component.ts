import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwnerService } from '../services/owner/owner.service';
import { UserService } from '../services/user/UserService';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  private formActive: HTMLElement | null = null;
  private loginVet: HTMLElement | null = null;
  private loginOwner: HTMLElement | null = null;
  userType: string='';  // Variable para almacenar el tipo de usuario

  constructor(
    private router: Router,
    private ownerService: OwnerService ,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.formActive = document.querySelector('.container-forms');
    this.loginVet = document.querySelector('.loginVet');
    this.loginOwner = document.querySelector('.loginOwner');
  }

  tab1(): void {
    if (this.formActive) this.formActive.style.marginLeft = '0';

    if (this.loginVet) {
      this.loginVet.style.opacity = '0.7';
      const vetImage = this.loginVet.querySelector('img');
      if (vetImage) vetImage.style.opacity = '0.7';
    }

    if (this.loginOwner) {
      this.loginOwner.style.opacity = '';
      const ownerImage = this.loginOwner.querySelector('img');
      if (ownerImage) ownerImage.style.opacity = '';
    }
  }

  tab2(): void {
    if (this.formActive) this.formActive.style.marginLeft = '-97%';

    if (this.loginVet) {
      this.loginVet.style.opacity = '1';
      const vetImage = this.loginVet.querySelector('img');
      if (vetImage) vetImage.style.opacity = '1';
    }

    if (this.loginOwner) {
      this.loginOwner.style.opacity = '0.7';
      const ownerImage = this.loginOwner.querySelector('img');
      if (ownerImage) ownerImage.style.opacity = '0.7';
    }
  }

  onSubmit(type: string): void {
    if (type === 'owner') {
      this.userType = 'owner';
      const idCardOwner = document.getElementById('idCardOwner') as HTMLInputElement;
      const idOwner = +idCardOwner.value;
      console.log("El usuario es", idOwner);
      if (!idOwner) {
        alert('Por favor ingrese su cédula');
      } else {
        const owner = this.ownerService.login(idOwner);
        if (owner) {
            // Suponiendo que tienes acceso al UserService
            this.userService.setUserType('user');  // O 'vet' dependiendo del tipo
            this.router.navigate(['/pet/all']);
        }
        else {
          alert("El usuario no existe");
        }
      }
    } else if (type === 'vet') {
        this.userType = 'vet';
      const idCardVet = document.getElementById('idCardVet') as HTMLInputElement;
      const passwordVet = document.getElementById('passwordVet') as HTMLInputElement;

      const idVet = idCardVet.value;
      const password = passwordVet.value;
      this.router.navigate(['/pet/all']);
      /*
      if (idVet === '') {
        alert('Por favor ingrese su cédula');
      }
      if (password === '') {
        alert('Por favor ingrese su contraseña');
      }*/
    }
  }
}
