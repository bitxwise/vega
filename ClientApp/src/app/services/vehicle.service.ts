import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaveVehicle } from '../models/saveVehicle';

@Injectable()
export class VehicleService {

  constructor(private httpClient: HttpClient) { }

  getFeatures() {
    return this.httpClient.get<any[]>('/api/features');
  }

  getMakes() {
    return this.httpClient.get<any[]>('/api/makes');
  }

  createVehicle(vehicle: SaveVehicle) {
    return this.httpClient.post('/api/vehicles', vehicle);
  }

  deleteVehicle(id) {
    return this.httpClient.delete('/api/vehicles/' + id);
  }

  getVehicle(id) {
    return this.httpClient.get('/api/vehicles/' + id);
  }

  getVehicles() {
    return this.httpClient.get<any[]>('/api/vehicles');
  }

  updateVehicle(vehicle: SaveVehicle) {
    return this.httpClient.put('/api/vehicles/' + vehicle.id, vehicle);
  }
}
