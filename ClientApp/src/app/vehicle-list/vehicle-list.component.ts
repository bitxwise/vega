import { VehicleService } from './../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Vehicle } from '../models/vehicle';
import { NamedProperty } from '../models/namedProperty';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  makes: NamedProperty[];
  allVehicles: Vehicle[];
  vehicles : Vehicle[];
  filter: any = {}

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getVehicles()
    ];

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.vehicles = this.allVehicles = data[1];
    })
  }

  onFilterChange() {
    let vehicles = this.allVehicles;

    if(this.filter.makeId) {
      vehicles = vehicles.filter(v => v.make.id == this.filter.makeId);
    }

    if(this.filter.modelId) {
      vehicles = vehicles.filter(v => v.model.id == this.filter.modelId);
    }

    this.vehicles = vehicles;
  }

  resetFilter() {
    this.filter = {};
    this.onFilterChange();
  }
}
