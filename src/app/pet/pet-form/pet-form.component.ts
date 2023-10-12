import { Component } from '@angular/core';
import { Pet } from 'src/app/model/pet/pet';
import {PetService} from "../../services/pet/pet.service";
import {OwnerService} from "../../services/owner/owner.service";
import { ActivatedRoute } from '@angular/router';
import { Owner } from 'src/app/model/owner/owner';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css']
})
export class PetFormComponent {

  constructor(private petService: PetService, private ownerService: OwnerService, private route: ActivatedRoute) { }

  sendPet!: Pet;

  formPet!: Pet

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if ('petId' in params) {
          const petId = Number(params['petId']);

          this.petService.findById(petId).subscribe(data => {
              this.formPet = new Pet(data.id, data.name, data.breed, data.birthdate, data.weight, data.disease, data.imgUrl, data.owner);

              // Luego, obtén el propietario usando findOwnerByPets_Id
              this.ownerService.findOwnerByPets_Id(petId).subscribe(owner => {
                  // Asigna el propietario a la mascota
                  this.formPet.owner = owner;
              });
          });
      }
  });
  }


  savePet() {
    // Change logic from owner
    this.sendPet = Object.assign({}, this.formPet);
    this.petService.addPet(this.formPet);
  }
}
