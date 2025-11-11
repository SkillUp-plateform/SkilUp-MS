export interface Payment {
    id?: number;
    userId: number;
    formationId: number;
    date: Date;
    price: string; // Add price field
  }
  