import { User } from './user.model';
export interface ImageUser {
    id: number;
    name: string;
    picByte: string; // Représentation base64 de l'image
    user: User; // Assurez-vous que le modèle User est correctement défini
  }