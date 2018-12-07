import { PhotoService } from './../services/photo.service';
import { VehicleService } from './../services/vehicle.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { Vehicle } from '../models/vehicle';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {

  vehicle: any;

  // separate field so we can leverage ngIf in the template
  vehicleId: number;

  @ViewChild('photoInput') photoInput: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private toastyService: ToastyService, private toastyConfig: ToastyConfig,
    private vehicleService: VehicleService, private photoService: PhotoService) {

    this.route.params.subscribe(p => {
      this.vehicleId = +p['id'];
      
      if(isNaN(this.vehicleId) || this.vehicleId <= 0) {
        this.router.navigate(['/vehicles']);
        return;
      }
    });
  }

  ngOnInit() {
    this.vehicleService.getVehicle(this.vehicleId).subscribe(
      v => this.vehicle = v,
      err => {
         if(err.status == 404) {
           this.router.navigate(['/vehicles']);
           return;
         }
      }
    );
  }

  delete() {
    if(confirm("Are you sure you want to delete this vehicle?")) {
       this.vehicleService.deleteVehicle(this.vehicle.id).subscribe(
        x => this.router.navigate([''])
       );
    }
  }

  uploadPhoto() {
    var photoElement: HTMLInputElement = this.photoInput.nativeElement;
    this.photoService.uploadPhoto(this.vehicleId, photoElement.files[0])
      .subscribe(x => console.log(x));
  }
}
