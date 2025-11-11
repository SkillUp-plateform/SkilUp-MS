import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuizServiceService } from '../quiz-service.service';
import { Quiz } from '../models/quiz';
import { Question } from '../models/question';

@Component({
  selector: 'app-quiz-user',
  templateUrl: './quiz-user.component.html',
  styleUrls: ['./quiz-user.component.css']
})
export class QuizUserComponent implements OnInit {

  quizList: Quiz[] = [];
  quizForm!: FormGroup;
  scores: { [quizId: number]: number | null } = {};
  isSidebarCollapsed = false;

  constructor(
    private quizService: QuizServiceService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.route.paramMap.subscribe(params => {
      const formationId = params.get('formationId');
      if (formationId) this.loadQuizzes(+formationId);
    });
  }

  initializeForm() {
    this.quizForm = this.fb.group({});
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  loadQuizzes(formationId: number) {
    this.quizService.getAllQuizzesByFormation(formationId).subscribe(
      (data: Quiz[]) => {
        this.quizList = data;
        this.buildForm();
      },
      err => console.error('Erreur chargement quiz:', err)
    );
  }

  buildForm() {
    const formGroupConfig: any = {};

    this.quizList.forEach(quiz => {
      this.scores[quiz.id!] = null;
      
      quiz.questions?.forEach(question => {
        const controlName = `question_${question.id}`;
        formGroupConfig[controlName] = [null]; // IMPORTANT: utiliser un tableau
      });
    });

    this.quizForm = this.fb.group(formGroupConfig);
    
    // Écouter les changements de valeur
    this.quizForm.valueChanges.subscribe(value => {
      console.log('🔄 Changement détecté:', value);
    });

    console.log('✅ FormGroup créé avec contrôles:', Object.keys(this.quizForm.controls));
    console.log('✅ État initial:', this.quizForm.value);
  }

  getQuestionControl(questionId: number): FormControl {
    return this.quizForm.get(`question_${questionId}`) as FormControl;
  }

  getOptions(question: Question) {
    return [
      { label: 'A', value: 'A', text: question.optionA },
      { label: 'B', value: 'B', text: question.optionB },
      { label: 'C', value: 'C', text: question.optionC },
      { label: 'D', value: 'D', text: question.optionD },
    ];
  }

  onAnswerSelected(questionId: number, value: string) {
    console.log(`📝 Question ${questionId} sélectionnée : ${value}`);
    
    // Mettre à jour manuellement la valeur
    const control = this.getQuestionControl(questionId);
    if (control) {
      control.setValue(value);
      console.log(`✅ Contrôle ${questionId} mis à jour:`, control.value);
    }
  }

  submitQuiz(quiz: Quiz) {
    console.log('🔄 Soumission du quiz:', quiz.id);
    console.log('📊 État COMPLET du formulaire:', this.quizForm.value);
    
    const answers: { [key: number]: string } = {};

    quiz.questions?.forEach(question => {
      const control = this.getQuestionControl(question.id!);
      const answer = control?.value;
      
      console.log(`❓ Question ${question.id}:`, answer, 'Control:', control);
      
      if (answer) {
        answers[question.id!] = answer;
      }
    });

    console.log('📤 Réponses envoyées au backend :', answers);

    if (Object.keys(answers).length === 0) {
      console.warn('⚠️ Aucune réponse sélectionnée pour ce quiz');
      alert('Veuillez sélectionner au moins une réponse avant de soumettre.');
      return;
    }

    this.quizService.submitQuiz(quiz.id!, answers).subscribe(
      res => {
        console.log(`✅ Quiz ${quiz.id} soumis avec succès`, res);
        this.scores[quiz.id!] = res.score;
      },
      err => console.error('❌ Erreur soumission quiz :', err)
    );
  }
}