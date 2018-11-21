import * as _ from 'underscore';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private router: Router, private vehicleService: VehicleService) {
    route.params.subscribe(p => this.vehicle.id = +p['id']);
  }

  ngOnInit() {
    var sources: Observable<any>[] = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];

    if(this.vehicle.id)
        sources.push(this.vehicleService.getVehicle(this.vehicle.id));

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.features = data[1];

      if(this.vehicle.id)
        this.setVehicle(data[2]);
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
    let selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);

    this.models = selectedMake ? selectedMake.models : [];

    delete this.vehicle.modelId;
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
  }

  submit() {
    this.vehicleService.createVehicle(this.vehicle)
      .subscribe(
        x => console.log(x)
      );
  }
}
