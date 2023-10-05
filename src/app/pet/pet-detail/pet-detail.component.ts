import {Component, Input} from '@angular/core';
import {Pet} from "../../model/pet/pet";
import {ActivatedRoute, Router} from "@angular/router";
import {PetService} from "../../services/pet/pet.service";

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.css']
})
export class PetDetailComponent {
  @Input()
  pet!: Pet;

  constructor(
    private petService: PetService,
    private route: ActivatedRoute,
    private router: Router)
  {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.petService.findById(id);
  }
}
