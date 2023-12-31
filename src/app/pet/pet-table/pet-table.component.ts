import {Component, Input} from '@angular/core';
import {Pet} from "../../model/pet/pet";
import {PetService} from "../../services/pet/pet.service";
import {ActivatedRoute, Router} from '@angular/router';
import {query} from "@angular/animations";

@Component({
    selector: 'app-pet-table',
    templateUrl: './pet-table.component.html',
    styleUrls: ['./pet-table.component.css']
})
export class PetTableComponent {

  @Input() userType: string ='';
  @Input() vetId: string = '';

  selectedPet!: Pet;

    petList!: Pet[];
    showAllPets: boolean = true;


    constructor(
        private petService: PetService
        ,private route: ActivatedRoute,
        private router: Router
    ) {

    }


    filterText: string = '';
    isNameFilterActive: boolean = false;


    ngOnInit(): void {

        this.route.queryParams.subscribe(params => {
            this.userType = params['type'].toString();
            //let type =  localStorage.getItem('userType');
            if (this.userType === 'vet' || this.userType === 'admin') {
              if ('id' in params) {
                this.vetId = params['id'].toString();
              }
              if ('ownerId' in params) {
                const ownerId = Number(params['ownerId']);
                this.petService.findByOwner(ownerId).subscribe(
                  data => this.petList = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x)).filter(pet => pet.status === 'En tratamiento')
                );
              }
              else {
                this.petService.showAllPetsInTreatment().subscribe({
                    next: (data) =>
                        this.petList = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x)),
                    error: (err) => console.error(err)

                });
              }

            } else if (this.userType == 'user') {
              const userId = params['ownerId'];
                this.petService.findByOwner(userId).subscribe(
                    data => this.petList = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x)).filter(pet => pet.status === 'En tratamiento')
                );
            }
            else {
                localStorage.setItem('userType',this.userType);
            }
        });
    }

    filterPetsByName() {
        if (this.isNameFilterActive) {
            return this.petList.filter(pet =>
                pet.name.toLowerCase().includes(this.filterText.toLowerCase())
            );
        } else {
            return this.petList; // If the checkbox is not active, return the full list
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
    const index = this.petList.indexOf(pet);
    this.petList.splice(index, 1);
  }


  filterPets() {
    if ('ownerId' in this.route.snapshot.queryParams ) {
      console.log("Aqui estamos viendo el owner")
      const ownerId = this.route.snapshot.queryParams['ownerId'];

      if (this.showAllPets) {
        this.petService.findByOwner(ownerId).subscribe((data: Pet[]) => {
          this.petList = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x)).filter(pet => pet.status === 'En tratamiento');
        });
      } else {
        this.petService.findByOwner(ownerId).subscribe((data: Pet[]) => {
          this.petList = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x)).filter(pet => pet.status === 'Alta');
        });
      }
    } else {
      console.log("Qui no tenemos el owner")
      if (this.showAllPets) {
        console.log("Aqui estamos viendo todos los pets en tratamiento")
        this.petService.showAllPetsInTreatment().subscribe((data: Pet[]) => {
          this.petList = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x));
        });
      } else {
        console.log("Aqui estamos viendo todos los pets dados de alta")
        this.petService.showAllPetsDischarged().subscribe((data: Pet[]) => {
          //imprimimos lo que nos llega
          console.log(data);
          if(data)
            this.petList = data.map(x => Object.assign(new Pet(x.id, x.name, x.breed, x.birthdate, x.weight, x.disease, x.imgUrl, x.owner), x));
          else
            this.petList = [];
        });
      }
    }
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    this.userType = '';
    this.vetId = '';
    this.router.navigate(['/login/show']);
  }



  protected readonly query = query;
  protected readonly String = String;
}
