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

  private readonly PAGE_SIZE = 3;

  makes: NamedProperty[];
  query: any = {
    pageSize: this.PAGE_SIZE,
    page: 1
  };
  queryResult: any = {};
  columns = [
    { title: "Id" },
    { title: "Make", key: "make", isSortable: true },
    { title: "Model", key: "model", isSortable: true },
    { title: "Contact Name", key: "contactName", isSortable: true },
    { }
  ];

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes().subscribe(makes => this.makes = makes);
    this.populateVehicles();
  }

  onFilterChanged() {
    this.query.page = 1;
    this.query.pageSize = this.PAGE_SIZE;
    this.populateVehicles();
  }

  onPageChanged(page) {
    this.query.page = page;
    this.populateVehicles();
  }

  populateVehicles() {
    this.vehicleService.getVehicles(this.query).subscribe(result => this.queryResult = result);
  }

  resetFilter() {
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE
    };
    this.populateVehicles();
  }

  sortBy(fieldName) {
    if(this.query.sortBy === fieldName)
      this.query.isSortAscending = !this.query.isSortAscending;
    else {
      this.query.sortBy = fieldName;
      this.query.isSortAscending = true;
    }

    this.populateVehicles();
  }
}
