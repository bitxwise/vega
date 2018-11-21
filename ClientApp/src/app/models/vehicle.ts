import { Contact } from "./contact";
import { NamedProperty } from "./namedProperty";

export interface Vehicle {
    id: number;
    make: NamedProperty;
    model: NamedProperty;
    isRegistered: boolean;
    features: NamedProperty[];
    contact: Contact;
}