import { Formateur } from './formateur.model';

export interface Formation {
  id: number;
  title: string;
  content: string;
  documentLink: string;
  meetingLink: string;
  videoLink: string;
  duration: string;
  date: string;
  prix: string;
  formateur: Formateur;
  keycloakFormateurId?: string;  // Add Keycloak formateur ID
}
