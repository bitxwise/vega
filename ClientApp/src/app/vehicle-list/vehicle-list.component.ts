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
  vehicles : Vehicle[];
  filter: any = {}

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getVehicles(this.filter)
    ];

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.vehicles = data[1];
    })
  }

  onFilterChange() {
    this.populateVehicles();
  }

  populateVehicles() {
    this.vehicleService.getVehicles(this.filter).subscribe(
      vehicles => this.vehicles = vehicles
    );
  }

  resetFilter() {
    this.filter = {};
    this.onFilterChange();
  }
}
