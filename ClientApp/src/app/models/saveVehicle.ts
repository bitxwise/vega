import { Contact } from "./contact";

export interface SaveVehicle {
    id: number;
    makeId: number;
    modelId: number;
    isRegistered: boolean;
    features: number[];
    contact: Contact;
}