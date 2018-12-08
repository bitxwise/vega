import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PhotoService {
    
    constructor(private httpClient: HttpClient) { }

    getPhotos(vehicleId) {
        return this.httpClient.get<any[]>(`/api/vehicles/${vehicleId}/photos`);
    }

    uploadPhoto(vehicleId, photo) {
        var formData = new FormData();
        formData.append('file',photo);

        return this.httpClient.post(`/api/vehicles/${vehicleId}/photos`, formData );
    }
}