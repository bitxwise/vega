import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MakeService {

  constructor(private httpClient: HttpClient) { }

  getMakes() {
    return this.httpClient.get<any[]>('/api/makes');
  }
}
