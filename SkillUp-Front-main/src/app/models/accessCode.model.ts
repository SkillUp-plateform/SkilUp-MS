import { Formation } from './formation.model';

export interface AccessCode {
  id: number;
  code: string; // Assurez-vous que le nom et le type sont corrects selon le modèle Spring Boot
  formation: Formation; // Assurez-vous que le modèle Formation est bien défini
}
