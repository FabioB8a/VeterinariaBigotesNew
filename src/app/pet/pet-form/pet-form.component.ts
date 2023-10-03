import { Component } from '@angular/core';
import { Pet } from 'src/app/model/pet/pet';
import {PetService} from "../../services/pet/pet.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css']
})
export class PetFormComponent {

  constructor(private petService: PetService, private route: ActivatedRoute) { }

  sendPet!: Pet;

  formPet: Pet = new Pet(
    0,
    '',
    '',
    new Date(),
    0,
    '',
    '',
    ''
  )

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if ('petId' in params) {
        const petId = Number(params['petId']);
        this.formPet = this.petService.findById(petId);
      }
    });
  }


  savePet() {
    this.formPet.birthdate = new Date(this.formPet.birthdate)
    this.sendPet = Object.assign({}, this.formPet);
    this.formPet.owner = "Luisa Parra"
    this.petService.savePet(this.formPet);
  }
}
