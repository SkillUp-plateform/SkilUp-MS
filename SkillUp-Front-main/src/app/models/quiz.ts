import { Question } from "./question";

export interface Quiz {
    id?: number;
    title: string;
    description: string;
    formationId: number;
    questions?: Question[];
    
  }

export { Question };
  