import {Injectable} from '@angular/core';
import {Pet} from "../../model/pet/pet";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(
    private http: HttpClient
  ) { }

  petList: Pet[] = [];

  findAll(): Observable<Pet[]>{
    return this.http.get<Pet[]>('http://localhost:8090/pet');
  }

  findByOwner(id:number): Observable<Pet[]>{
    return this.http.get<Pet[]>('http://localhost:8090/pet/owner/' + id);
  }

  findById(id:number): Observable<Pet>{
    const pet = this.http.get<Pet>("http://localhost:8090/pet/" + id);
    return pet;
  }

 addPet(newPet: Pet) {
    this.http.post("http://localhost:8090/pet", newPet).subscribe();
  }

  updatePet(changedPet: Pet) {
    this.http.put("http://localhost:8090/pet", changedPet).subscribe();
  }

  deleteById(id: number) {
    this.http.delete("http://localhost:8090/pet/" + id).subscribe();
  }

  ownerPets(id:number){
    this.http.get("http://localhost:8090/owner/pet/"+id).subscribe();
  }

  getNumberOfPets(): Observable<number>{
    return this.http.get<number>('http://localhost:8090/pet/count/total');
  }

  getNumberOfPetsOnTreatment(): Observable<number>{
    return this.http.get<number>('http://localhost:8090/pet/count/ontreatment');
  }

  showAllPetsInTreatment(): Observable<Pet[]>{
    return this.http.get<Pet[]>('http://localhost:8090/pet/all/ontreatment');
  }

  updatePetStatus(id: number, status: string) {
    return this.http.put<Pet>(`http://localhost:8090/pet/updateStatus/${id}`, { status });
  }


  showAllPetsDischarged(): Observable<Pet[]>{
    return this.http.get<Pet[]>('http://localhost:8090/pet/all/discharge');
  }

  petExists(pet:Pet): Observable<boolean> {
    //Se envian como parametros el nombre, la raza, el peso y la fecha de nacimiento
    return this.http.get<boolean>("http://localhost:8090/pet/exists/" + pet.name + "/" + pet.breed + "/" + pet.weight + "/" + pet.birthdate + "/" + pet.disease);
  }
}
