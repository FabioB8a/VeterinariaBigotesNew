import {Component, Input} from '@angular/core';
import {Pet} from "../../model/pet/pet";
import {Drug} from "../../model/drug/drug";
import {Veterinarian} from "../../model/veterinarian/veterinarian";
import {Treatment} from "../../model/treatment/treatment";
import {DrugService} from "../../services/drug/drug.service";
import {TreatmentService} from "../../services/treatment/treatment.service";
import {VetService} from "../../services/vet/vet.service";
import {PetService} from "../../services/pet/pet.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent {
  @Input() pet?: Pet;
  @Input() userType: string = '';
  drugList: Drug[] = [];
  selectedDrug?: Drug | undefined;
  description: string = '';
  veterinarian?: Veterinarian;
  treatmentList: Treatment[] = []; // Lista de tratamientos
  @Input() vetId: string = '';
  id: number = 0;

    constructor(
        private drugService: DrugService,
        private treatmentService: TreatmentService,
        private vetService: VetService,
        private petService: PetService,
        private route: ActivatedRoute,
        private router: Router
    ) {

    }

    ngOnInit(): void {

        this.id = Number(this.route.snapshot.paramMap.get('id'));

        this.petService.findById(this.id).subscribe((data) => {
            this.pet = new Pet(data.id, data.name, data.breed, data.birthdate, data.weight, data.disease, data.imgUrl, data.owner);
            this.pet.status = data.status;
            this.treatmentService.showTreatmentbyPet(this.pet.id).subscribe((data) => {
                this.treatmentList = data;
            });
        });
        this.route.queryParams.subscribe(params => {
            this.userType = params['type'].toString();
            this.vetId = params['id'].toString();
        });
        if (this.vetId) {
            this.vetService.findByIdCard(Number(this.vetId)).subscribe((data) => {
                this.veterinarian = data;
            });
        }
        this.drugService.findDrugsAvailabale().subscribe((data) => {
            this.drugList = data;
        });
        console.log("EL user es ", this.userType)
    }

    agregarMedicamento() {
        if (this.selectedDrug && this.description !== '' && this.pet && this.veterinarian) {
            const newTreatment: Treatment = {
                id: 0,  // El ID es asignado por la API, 0 solo es un marcador temporal
                date: new Date(),
                pet: this.pet,
                drug: this.selectedDrug,
                veterinarian: this.veterinarian,
                description: this.description,
                treatedDisease: this.pet.disease
            };

            // Actualiza las cantidades de la droga
            if (this.selectedDrug){
                // @ts-ignore
                this.selectedDrug.itemsAvailable -= 1;
                // @ts-ignore
                this.selectedDrug.itemsSell += 1;
                this.drugService.updateDrug(this.selectedDrug);
            }

            this.treatmentService.addTreatment(newTreatment).subscribe((response) => {
                // El tratamiento recién creado debe incluir su ID generado
                if (response) {
                    // Agrega el tratamiento a la lista en el frontend
                    this.treatmentList.push(response);
                    // Limpiar selección y descripción después de agregar el tratamiento
                    this.selectedDrug = undefined;
                    this.description = '';
                }
            });
        } else {
            alert("Por favor, rellene todos los campos");
        }
    }

}
