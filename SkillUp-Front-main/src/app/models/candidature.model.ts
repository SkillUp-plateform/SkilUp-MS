export enum CandidatureStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface CandidatureResponse {
  id: number;
  userId?: number;  // Legacy - deprecated
  keycloakFormateurId: string;  // Keycloak UUID
  status: CandidatureStatus;
  motivation?: string;
  createdAt: string;    // ISO date string renvoyée par backend
  updatedAt: string;    // ISO date string renvoyée par backend
  cvPath?: string | null;
}