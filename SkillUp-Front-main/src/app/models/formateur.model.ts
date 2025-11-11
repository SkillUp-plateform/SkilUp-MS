export interface Formateur{
    id: number | string;  // Support both number (legacy) and string (Keycloak UUID)
    keycloakId?: string;  // Keycloak UUID
    username: string;
    email: string;
    speciality: string;
    firstname: string;
    lastname: string;
    address: string;
    password: string;
}