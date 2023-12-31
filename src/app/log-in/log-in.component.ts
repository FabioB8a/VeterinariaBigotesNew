import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwnerService } from '../services/owner/owner.service';
import { Owner } from '../model/owner/owner';
import {VetService} from "../services/vet/vet.service";
import {UserEntity} from "../model/user/user";
import {AuthService} from "../services/auth/auth.service";



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
    selectedOwner?: Owner | null;
    constructor(
        private router: Router,
        private ownerService: OwnerService,
        private vetService: VetService,
        private authService: AuthService
    ) {}

    idCard: number = 0;

    ngOnInit(): void {

        if (this.authService.isAuthenticated()) {
            this.authService.userType(localStorage.getItem('token') as string).subscribe(
                (data) => {
                    this.idCard = data.idCard;
                    this.userType = data.role;
                    localStorage.setItem('userType', this.userType);
                    if (this.userType === 'OWNER') {
                        this.router.navigate(['/pet/all'], { queryParams: { ownerId: this.idCard, type: "user" }});
                    } else if (this.userType === 'VET') {
                        this.router.navigate(['/pet/all'], { queryParams: { id: this.idCard, type: "vet" } });
                    } else if (this.userType === 'ADMIN') {
                        this.router.navigate(['/admin/dashboard']);
                    }
                }
            );
        }

        this.formActive = document.querySelector('.container-forms');
        this.loginVet = document.querySelector('.loginVet');
        this.loginOwner = document.querySelector('.loginOwner');

        localStorage.removeItem('userType');
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
            if (!idOwner) {
              alert('Por favor ingrese su cédula');
              return;
            }

            let user = {username: idOwner, password: "123"} as UserEntity;

            this.ownerService.login(user).subscribe(

                (data) => {
                    localStorage.setItem('token', String(data));
                    this.router.navigate(['/pet/all'], { queryParams: { ownerId: idOwner, type: "user" } });
                },
                (error) => {
                    if (error.status === 401 || error.status === 400) {
                        // Handle incorrect credentials
                        alert("La cédula es incorrecta");
                    } else {
                        // Handle other types of errors (like network issues, server errors, etc.)
                        alert("Error al intentar iniciar sesión");
                    }
                }
            );

        } else if (type === 'vet') {

            this.userType = 'vet';
            const idCardVet = document.getElementById('idCardVet') as HTMLInputElement;
            const passwordVet = document.getElementById('passwordVet') as HTMLInputElement;

            const idVet = +idCardVet.value;
            const password = passwordVet.value;

            if (!idVet) {
                alert('Por favor ingrese su cédula');
                return;
            }
            if (!password) {
                alert('Por favor ingrese su contraseña');
                return;
            }
            let user = {username: idVet, password: password} as UserEntity;

            this.vetService.login(user).subscribe(

                (data) => {
                    localStorage.setItem('token', String(data));
                    this.router.navigate(['/pet/all'], { queryParams: { id: idVet, type: "vet" } });
                },
                (error) => {
                    // Handle errors here
                    if (error.status === 401 || error.status === 400) {
                        // Handle incorrect credentials
                        alert("La cédula o la contraseña son incorrectas");
                    } else {
                        // Handle other types of errors (like network issues, server errors, etc.)
                        alert("Error al intentar iniciar sesión");
                    }
                }
            );
        }
    }
}
