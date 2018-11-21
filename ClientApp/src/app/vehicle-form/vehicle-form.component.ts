import { VehicleService } from '../services/vehicle.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(private vehicleService: VehicleService) {
    
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
        x => console.log(x)
      );
  }
}
