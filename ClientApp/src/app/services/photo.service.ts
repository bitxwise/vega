import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable()
export class PhotoService {
    
    constructor(private httpClient: HttpClient) { }

    getPhotos(vehicleId) {
        return this.httpClient.get<any[]>(`/api/vehicles/${vehicleId}/photos`);
    }

    uploadPhoto(vehicleId, photo) {
        const formData = new FormData();
        formData.append('file',photo);

        const request = new HttpRequest('POST', `/api/vehicles/${vehicleId}/photos`, formData, { reportProgress: true });

        return this.httpClient.request(request);
    }
}