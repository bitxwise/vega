import { PhotoService } from './../services/photo.service';
import { VehicleService } from './../services/vehicle.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { Vehicle } from '../models/vehicle';
import { HttpEvent, HttpEventType } from '@angular/common/http';

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
  photos: any[];

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

    this.photoService.getPhotos(this.vehicleId).subscribe(
      p => this.photos = p
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
      .subscribe((event: HttpEvent<any>) => {
        console.log(event)
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request sent!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header received!');
            break;
          case HttpEventType.UploadProgress:
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${percentDone}% uploaded.`);
          case HttpEventType.DownloadProgress:
            const kbLoaded = Math.round(event.loaded / 1024);
            console.log(`Download in progress! ${ kbLoaded }Kb loaded`);
            break;
          case HttpEventType.Response:
            this.photos.push(event.body);
            console.log('Done!', event.body);
        }
      });
  }
}
