import {Component, Input} from '@angular/core';
import {Owner} from "../../model/owner/owner";
import {Pet} from "../../model/pet/pet";
import {OwnerService} from "../../services/owner/owner.service";
import {PetService} from "../../services/pet/pet.service";
import {ActivatedRoute, Router} from "@angular/router";
import {concat, first, forkJoin} from "rxjs";

@Component({
  selector: 'app-owner-details',
  templateUrl: './owner-details.component.html',
  styleUrls: ['./owner-details.component.css']
})
export class OwnerDetailsComponent {
  @Input() owner: Owner = new Owner(0, 0, "", "", "", "", "");
  @Input() userType: string = '';
  @Input() vetId: string = '';
  petlist!: Pet[];
  showAllPets: boolean = true;
  id!: number;
  pet?: Pet | undefined;
  formPet: any = {};
  sendPet!: Pet;
  constructor(
    private ownerService: OwnerService,
    private petService: PetService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.ownerService.findById(this.id).subscribe((data) => {
      this.owner = new Owner(data.id, data.idCard, data.firstName, data.firstLastName, data.secondLastName, data.phone, data.email);
      this.petService.findByOwner(this.owner.idCard).subscribe(
        data => this.petlist = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x)).filter(pet => pet.status === 'En tratamiento')
      );
    });
    if ('type' in this.route.snapshot.queryParams) {
      this.userType = this.route.snapshot.queryParams['type'].toString();
    }
    if ('id' in this.route.snapshot.queryParams) {
      this.vetId = this.route.snapshot.queryParams['id'].toString();
    }

  }

  filterPets() {

    if (this.showAllPets) {
      this.petService.findByOwner(this.id).subscribe(
        data => this.petlist = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x)).filter(pet => pet.status === 'En tratamiento')
      );
    } else {
      this.petService.findByOwner(this.id).subscribe(
        data => this.petlist = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x)).filter(pet => pet.status === 'Alta')
      );
    }

  }

  deleteById(pet: Pet): void {
    const id = pet.id;
    const newStatus = 'Alta';  // Cambiar el estado a 'Alta' o el estado deseado
    const newDisease = 'ninguna'; // Cambiar la enfermedad a 'ninguna' o la enfermedad deseada

    // Cambia el estado de la mascota directamente a través del servicio
    pet.status = newStatus;
    pet.disease = newDisease;

    this.petService.updatePet(pet);
    // Cuando se actualiza el estado, elimina la mascota de la lista
    const index = this.petlist.indexOf(pet);
    this.petlist.splice(index, 1);
  }

  editPet(pet: Pet): void {
    this.formPet = new Pet(pet.id, pet.name, pet.breed, pet.birthdate, pet.weight, pet.disease, pet.imgUrl, pet.owner);
    console.log("Estamos por aqupi ");
  }
  actualizarMascota(): void {
   if (!this.verifyForm()) {
      return;
    }
   console.log("El usuario actual es ", this.userType);
   this.sendPet = Object.assign({}, this.formPet);
   console.log("El sendPet es ", this.sendPet);
   this.petService.updatePet(this.sendPet);
   //eliminar los datos del formulario
    this.formPet = {};
    //actualizar la lista de mascotas
   this.loadPetList();

  }

  private verifyForm() {
      if (!this.formPet.name) {
          alert("El campo nombre es obligatorio.");
          return false;
      }
      if (!this.formPet.breed) {
          alert("El campo raza es obligatorio.");
          return false;
      }
      if (!this.formPet.birthdate) {
          alert("El campo fecha de nacimiento es obligatorio.");
          return false;
      }
      if (!this.formPet.weight || this.formPet.weight <= 0 || isNaN(this.formPet.weight)) {
          alert("El campo peso es obligatorio y debe ser mayor a 0.");
          return false;
      }
      if (!this.formPet.disease) {
          alert("El campo enfermedad es obligatorio.");
          return false;
      }
      if (!this.formPet.imgUrl) {
          alert("El campo imagen es obligatorio.");
          return false;
      }
      return true;
  }
    private loadPetList(): void {
        // Espera 500ms para asegurarte de que la actualización en la base de datos se haya completado
        setTimeout(() => {
            this.petService.findByOwner(this.owner.idCard).subscribe(
                data => {
                    this.petlist = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x))
                        .filter(pet => this.showAllPets ? pet.status === 'En tratamiento' : pet.status === 'Alta');
                }
            );
        }, 500);
    }

}