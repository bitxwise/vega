import { VehicleService } from '../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {

  features: any[];
  makes: any[];
  models: any[];
  vehicle: any = {
    contact: {},
    features: []
  };

  constructor(private vehicleService: VehicleService, private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
      // Assign the selected theme name to the `theme` property of the instance of ToastyConfig. 
      // Possible values: default, bootstrap, material
      this.toastyConfig.theme = 'material';
    }

  ngOnInit() {
    this.vehicleService.getMakes().subscribe(
      makes => this.makes = makes
    );

    this.vehicleService.getFeatures().subscribe(
      features => this.features = features
    );
  }

  onFeatureToggle(featureId, $event) {
    if($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      var featureIndex = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(featureIndex, 1);
    }
  }

  onMakeChange() {
    let selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);

    this.models = selectedMake ? selectedMake.models : [];

    delete this.vehicle.modelId;
  }

  submit() {
    this.vehicleService.createVehicle(this.vehicle)
      .subscribe(
        x => { 
          console.log(x);
          this.addToast("success", "Success", "Your vehicle has been created.");
        },
        err => {
          this.addToast("error", "Error", "An unexpected error occurred. Your vehicle was not created.")
        }
      );
  }

  // helpers
  addToast(toastType, toastTitle, toastMessage) {
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
