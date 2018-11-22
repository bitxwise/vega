import * as _ from 'underscore';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { SaveVehicle } from './../models/saveVehicle';
import { Vehicle } from '../models/vehicle';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {

  features: any[];
  makes: any[];
  models: any[];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      email: '',
      name: '',
      phone: ''
    }
  };

  constructor(private route: ActivatedRoute, private router: Router, private toastyService: ToastyService, private toastyConfig: ToastyConfig, private vehicleService: VehicleService) {
    route.params.subscribe(p => this.vehicle.id = +p['id']);

    // Assign the selected theme name to the `theme` property of the instance of ToastyConfig. 
    // Possible values: default, bootstrap, material
    this.toastyConfig.theme = 'material';
  }

  ngOnInit() {
    var sources: Observable<any>[] = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];
    
    if(this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));
    
    // protect against NULL vehicle.id value, which would result in "Error converting value {null} to type 'System.Int32'"
    else
      this.vehicle.id = 0;

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.features = data[1];

      if(this.vehicle.id) {
        this.setVehicle(data[2]);
        this.populateModels();
      }
    }, err => {
      if(err.status == 404)
        this.router.navigate(['']);
      else
        throw err;
    });
  }

  onFeatureToggle(featureId, $event) {
    if($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      let featureIndex = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(featureIndex, 1);
    }
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    let selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
  }

  delete() {
    if(confirm("Are you sure you want to delete this vehicle?")) {
       this.vehicleService.deleteVehicle(this.vehicle.id).subscribe(
        x => this.router.navigate([''])
       );
    }
  }

  submit() {
    if(this.vehicle.id)
      this.vehicleService.updateVehicle(this.vehicle).subscribe(
        x => {
          console.log(x);
          this.addToast('success', 'Vehicle Updated', 'Your vehicle has been updated.')
        }
      );
    else
      this.vehicleService.createVehicle(this.vehicle).subscribe(
        x => {
          console.log(x);
          this.addToast('success', 'Vehicle Created', 'Your vehicle has been created.')
        }
      );
  }

  // TODO: duplicated from app.error-handler.ts - should find a better place for this
  private addToast(toastType, toastTitle, toastMessage) {
    let toastOptions:ToastOptions = {
      title: toastTitle,
      msg: toastMessage,
      showClose: true,
      timeout: 5000,
      theme: 'default',
      onAdd: (toast:ToastData) => {
          console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function(toast:ToastData) {
          console.log('Toast ' + toast.id + ' has been removed!');
      }
    };

    switch (toastType) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }
}
