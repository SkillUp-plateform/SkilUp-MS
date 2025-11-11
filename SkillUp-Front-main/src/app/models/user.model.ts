export interface User{
id:number;
username:string;
email:string;
firstname:string;
lastname:string;
address:string;
password:string;
role?: string;
keycloakId?: string;  // Keycloak UUID
sub?: string;  // JWT subject claim (Keycloak ID)
}
