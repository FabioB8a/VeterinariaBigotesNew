import { Component } from '@angular/core';
import { Pet } from 'src/app/model/pet/pet';
import { PetService } from "../../services/pet/pet.service";
import { OwnerService } from "../../services/owner/owner.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Owner } from 'src/app/model/owner/owner';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css']
})
export class PetFormComponent {

  constructor(private petService: PetService, private ownerService: OwnerService, private route: ActivatedRoute, private router: Router) { }

  sendPet!: Pet;
  formPet : Pet = {
    id: 0,
    name: '',
    disease: '',
    birthdate: '',
    weight: 0,
    breed: '',
    status: '',
    calculateAge() {
        return 0
    },
    imgUrl: ''
  };

  petId!: any;
  idCardText!: any;


  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      if ('petId' in params) {
        this.petId = Number(params['petId']);

        this.petService.findById(this.petId).subscribe(data => {
          this.formPet = new Pet(data.id, data.name, data.breed, data.birthdate, data.weight, data.disease, data.imgUrl, data.owner);
          this.idCardText = data.owner?.idCard
        });
      }
    });
  }

  savePet() {
    console.log(this.idCardText);
  
    this.ownerService.login(this.idCardText).subscribe(data => {
      this.formPet.owner = new Owner(data.id, data.idCard, data.firstName, data.firstLastName, data.secondLastName, data.phone, data.email);
      console.log(this.formPet.owner);
  
      // Now that the owner data is updated, proceed with saving the pet
      this.sendPet = Object.assign({}, this.formPet);
  
      if (this.petId != null) {
        this.petService.updatePet(this.sendPet!!);
      } else {
        this.petService.addPet(this.sendPet!!);
      }
  
      this.leave();
    });
  }

  leave(){
    this.router.navigate(['/pet/all'], {queryParams: {type: "vet"}});
  }
  
}
