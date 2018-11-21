import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VehicleService {

  constructor(private httpClient: HttpClient) { }

  getFeatures() {
    return this.httpClient.get<any[]>('/api/features');
  }

  getMakes() {
    return this.httpClient.get<any[]>('/api/makes');
  }

  createVehicle(vehicle) {
    return this.httpClient.post('/api/vehicles', vehicle);
  }

  getVehicle(id) {
    return this.httpClient.get('/api/vehicles/' + id);
  }
}
