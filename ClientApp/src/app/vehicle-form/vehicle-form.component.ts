import { VehicleService } from '../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { ActivatedRoute, Router } from '@angular/router';

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
        this.vehicle = data[2];
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

  submit() {
    this.vehicleService.createVehicle(this.vehicle)
      .subscribe(
        x => console.log(x)
      );
  }
}
