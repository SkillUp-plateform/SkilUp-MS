export interface Question {
    id?: number;               // optionnel si généré côté backend
    questionText: string;      // texte de la question
    optionA: string;           // première option
    optionB: string;           // deuxième option
    optionC: string;           // troisième option
    optionD: string;           // quatrième option
    correctAnswer: string;     // bonne réponse (ex: "A", "B", "C", ou "D")
    quizId?: number;          // ID du quiz auquel la question appartient (optionnel)
  }
  