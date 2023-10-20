import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OwnerService} from "../../services/owner/owner.service";
import {Owner} from "../../model/owner/owner";

@Component({
  selector: 'app-owner-detail',
  templateUrl: './owner-detail.component.html',
  styleUrls: ['./owner-detail.component.css']
})
export class OwnerDetailComponent {
  @Input() owner: Owner= new Owner(0, 0, "", "", "", "", "");
  @Input() userType: string = '';
  @Input() vetId: string = '';

  constructor(
    private ownerService: OwnerService,
    private route: ActivatedRoute,
    private router: Router)
  {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ownerService.findById(id).subscribe((data) => {
      this.owner = new Owner(data.id,data.idCard,data.firstName,data.firstLastName,data.secondLastName,data.phone,data.email);
    });
    if ('type' in this.route.snapshot.queryParams){
      this.userType = this.route.snapshot.queryParams['type'].toString();
    }
    if ('id' in this.route.snapshot.queryParams){
      this.vetId = this.route.snapshot.queryParams['id'].toString();
    }

  }

}
