import { PhotoService } from './../services/photo.service';
import { VehicleService } from './../services/vehicle.service';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService, ToastyConfig } from 'ng2-toasty';
import { Vehicle } from '../models/vehicle';
import { HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';

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
  uploadProgress: any;

  constructor(private route: ActivatedRoute, private router: Router, private toastyService: ToastyService, private toastyConfig: ToastyConfig, private zone: NgZone,
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
    this.uploadProgress = 0;
    
    const photoElement: HTMLInputElement = this.photoInput.nativeElement;
    const file = photoElement.files[0];
    photoElement.value = '';

    this.photoService.uploadPhoto(this.vehicleId, file)
      .subscribe((event: HttpEvent<any>) => {
        console.log(event)
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Upload request sent');
            break;
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            this.zone.run(() => this.uploadProgress = progress);
            console.log(`Upload ${progress}% complete`);
            break;
          case HttpEventType.Response:
            this.photos.push(event.body);
            console.log('Upload complete', event.body);
            break;
        }
      }, (err: HttpErrorResponse) => {
        this.toastyService.error({
          title: 'Error',
          msg: err.error,
          theme: 'default',
          showClose: true,
          timeout: 5000
        });
        console.log(err);
        if (err.error instanceof Error) {
          console.log("Client-side error");
        } else {
          console.log("Server-side error");
        }
      }, () => this.uploadProgress = null);
  }
}
