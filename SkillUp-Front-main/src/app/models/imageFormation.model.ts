import { Formation } from './formation.model';
export interface ImageFormation {
    id: number;
    name: string;
    picByte: string; // Représentation base64 de l'image
    formation: Formation; // Assurez-vous que le modèle User est correctement défini
  }