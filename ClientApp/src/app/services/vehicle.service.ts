import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaveVehicle } from '../models/saveVehicle';

@Injectable()
export class VehicleService {

  private readonly vehiclesEndpoint = "/api/vehicles";

  constructor(private httpClient: HttpClient) { }

  getFeatures() {
    return this.httpClient.get<any[]>('/api/features');
  }

  getMakes() {
    return this.httpClient.get<any[]>('/api/makes');
  }

  createVehicle(vehicle: SaveVehicle) {
    return this.httpClient.post(this.vehiclesEndpoint, vehicle);
  }

  deleteVehicle(id) {
    return this.httpClient.delete(this.vehiclesEndpoint + '/' + id);
  }

  getVehicle(id) {
    return this.httpClient.get(this.vehiclesEndpoint + '/' + id);
  }

  getVehicles(filter) {
    return this.httpClient.get<any[]>(this.vehiclesEndpoint + '?' + this.toQueryString(filter));
  }

  updateVehicle(vehicle: SaveVehicle) {
    return this.httpClient.put(this.vehiclesEndpoint + '/' + vehicle.id, vehicle);
  }

  toQueryString(filter) {
    let parts = [];

    for(let field in filter) {
      let value = filter[field];
      
      if(value != null && value != undefined)
        parts.push(encodeURIComponent(field) + "=" + encodeURIComponent(value));
    }

    return parts.join('&');
  }
}
