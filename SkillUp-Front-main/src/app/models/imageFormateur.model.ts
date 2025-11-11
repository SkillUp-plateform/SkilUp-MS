import { Formateur } from './formateur.model';
export interface ImageFormateur {
    id: number;
    name: string;
    picByte: string; // Représentation base64 de l'image
    formateur: Formateur; // Assurez-vous que le modèle User est correctement défini
  }