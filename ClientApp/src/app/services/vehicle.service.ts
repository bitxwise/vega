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

  getVehicles() {
    return this.httpClient.get<any[]>(this.vehiclesEndpoint);
  }

  updateVehicle(vehicle: SaveVehicle) {
    return this.httpClient.put(this.vehiclesEndpoint + '/' + vehicle.id, vehicle);
  }
}
