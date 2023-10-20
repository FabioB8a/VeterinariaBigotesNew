import {Component, Input} from '@angular/core';
import {Owner} from "../../model/owner/owner";
import {ActivatedRoute, Router} from "@angular/router";
import {OwnerService} from "../../services/owner/owner.service";
import {concat, first, forkJoin} from "rxjs";

@Component({
    selector: 'app-owner-form',
    templateUrl: './owner-form.component.html',
    styleUrls: ['./owner-form.component.css']
})
export class OwnerFormComponent {

  @Input() userType: string = '';
  @Input() vetId: string = '';
    constructor(private ownerService: OwnerService, private route: ActivatedRoute, private router: Router) {
    }

    sendOwner!: Owner;

    formOwner: any = {};  // Initialize formOwner as an empty object or with default values

    ngOnInit() {

        this.route.queryParams.subscribe(params => {
            if ('ownerId' in params) {
                const ownerId = Number(params['ownerId']);
                this.ownerService.findById(ownerId).subscribe(
                    data => this.formOwner = new Owner(data.id, data.idCard, data.firstName, data.firstLastName, data.secondLastName, data.phone, data.email)
                );
            }
            if ('type' in params){
              this.userType = params['type'].toString();
              console.log("nuestro user en el momento de entrar es", this.userType)
            }
            if ('id' in params){
              this.vetId = params['id'].toString();
            }
        });
    }

    saveOwner() {
        if (!this.verifyForm()) {
            return;
        }

        this.sendOwner = Object.assign({}, this.formOwner);

        if (this.sendOwner.id == null) {
            const ownerExistsByIdCard$ = this.ownerService.ownerExistsByIdCard(this.sendOwner.idCard).pipe(first());
            const ownerExistsByEmail$ = this.ownerService.ownerExistsByEmail(this.sendOwner.email).pipe(first());
            const ownerExistsByPhone$ = this.ownerService.ownerExistsByPhone(this.sendOwner.phone).pipe(first());

            forkJoin({
                idCard: ownerExistsByIdCard$,
                email: ownerExistsByEmail$,
                phone: ownerExistsByPhone$
            }).subscribe(results => {
                if (results.idCard) {
                    alert("Ya existe un dueño con el mismo número de cédula");
                } else if (results.email) {
                    alert("Ya existe un dueño con el mismo correo");
                } else if (results.phone) {
                    alert("Ya existe un dueño con el mismo teléfono");
                } else {
                    this.ownerService.addOwner(this.sendOwner);
                    console.log("El usuario actual es ", this.userType)
                    this.router.navigate(['/owner/all'], {queryParams: {type:this.userType }});
                }
            });
        } else {
            this.ownerService.updateOwner(this.sendOwner);
            console.log("El usuario actual es ", this.userType)
            this.router.navigate(['/owner/all'], {queryParams: {type:this.userType }});
        }
    }

    verifyForm() {
        if (!this.formOwner.firstName) {
            alert("El campo nombre es obligatorio.");
            return false;
        }

        if (!this.formOwner.firstLastName) {
            alert("El primer apellido es obligatorio.");
            return false;
        }

        if (!this.formOwner.secondLastName) {
            alert("El segundo apellido es obligatorio.");
            return false;
        }

        if (!this.formOwner.idCard || isNaN(this.formOwner.idCard)) {
            alert("El número de cédula es obligatorio y debe ser un número.");
            return false;
        }

        if (!this.formOwner.phone || isNaN(this.formOwner.phone)) {
            alert("El número de teléfono es obligatorio y debe ser un número.");
            return false;
        }

        if (!this.formOwner.email || !this.isValidEmail(this.formOwner.email)) {
            alert("El correo electrónico es obligatorio y debe ser un correo válido.");
            return false;
        }

        return true;
    }

    isValidEmail(email: string): boolean {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


}
