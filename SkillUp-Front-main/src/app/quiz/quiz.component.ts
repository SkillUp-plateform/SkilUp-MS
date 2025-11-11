import { Component, OnInit } from '@angular/core';
import { Quiz } from '../models/quiz';
import { QuizServiceService } from '../quiz-service.service';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../models/question';
import { QuestionService } from '../question.service';

declare const bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  questions: Question[] = [];
  question : Question = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '' };
  quiz: Quiz = { title: '', description: '', formationId: 0 };
  quizToDelete?: Quiz;
  questionToDelete?: Question;
  quizCount = 0;
  quizIdForQuestion: number | undefined;
  isSidebarCollapsed = false;
  formationId: number | undefined ;
  constructor(private quizService: QuizServiceService, private questionService: QuestionService,
    private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('formationId');
      if (id) {
        this.formationId = +id;
        this.loadQuizzes(this.formationId);
        //this.loadQuestions();
        this.loadQuestionsByQuiz(this.quizIdForQuestion ?? 0);
      }
    });
  }
    
  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe(data => {
      this.questions = data;
    });
  }

  loadQuizzes(formationId:number): void {

    this.quizService.getAllQuizzesByFormation(this.formationId ?? 0).subscribe(data => {
      this.quizzes = data;
      this.quizCount = data.length;
    });
  }

  loadQuestionsByQuiz(quizId: number): void {
    this.quizIdForQuestion = quizId; // ✅ on garde l'id sélectionné
    this.questionService.getAllQuestionsByQuiz(quizId).subscribe(data => {
      this.questions = data;
      console.log('Questions du quiz', quizId, data);
    });
  }

  getQuizTitleById(id?: number): string | null {
    if (id == null) return null;
    const q = this.quizzes.find(x => x.id === id);
    return q ? q.title : null;
  }

  // Ajout Modal
  openAjoutModal() {
    $('#ajouModel').modal('show');
  }

  openAjouQuestionModal(quizId: number) {
    this.quizIdForQuestion = quizId; // stocke l'ID du quiz sélectionné
    $('#ajouQuestionModel').modal('show');
  }

  closeAjoutModal() {
    $('#ajouModel').modal('hide');
  }

  closeAjouQuestionModal() {
    $('#ajouQuestionModel').modal('hide');
  }

  createQuestion(): void {
    if (!this.quizIdForQuestion) {
      alert("Erreur : aucun quiz sélectionné  !");
      return;
    }
    this.question.quizId = this.quizIdForQuestion;  // utilise l'ID réel du quiz

    this.questionService.createQuestion(this.question, this.quizIdForQuestion).subscribe(() => {
      this.closeAjouQuestionModal();
      this.question = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '' };
    });
  }
  

  createQuiz(): void {
    this.quizService.createQuiz(this.quiz, this.formationId ?? 0).subscribe((createdQuiz) => {
      this.quiz = createdQuiz;           // récupère le quiz avec son ID
          // stocke l'ID pour les questions
      this.closeAjoutModal();
      this.loadQuizzes(this.formationId ?? 0);
      // reset formulaire si besoin
      this.quiz = { title: '', description: '', formationId: this.formationId ?? 0 };
    });
  }
  

  openDeleteModal(quiz: Quiz): void {
    this.quizToDelete = quiz;
    $('#deleteModal').modal('show');
  }
  
  closeDeleteModal() {
    $('#deleteModal').modal('hide');
  }

  openDeleteQuestionModal(question: Question): void {
    this.questionToDelete = question;
    $('#deleteQuestionModal').modal('show');
  }
  
  closeDeleteQuestionModal() {
    $('#deleteQuestionModal').modal('hide');
  }

  deleteQuestion(): void {
    if (this.questionToDelete?.id) {
      this.questionService.deleteQuestion(this.questionToDelete.id).subscribe(() => {
        this.closeDeleteQuestionModal();
        this.loadQuestions();
      });
    }
  }

  deleteQuiz(): void {
    if (this.quizToDelete?.id) {
      this.quizService.deleteQuiz(this.quizToDelete.id).subscribe(() => {
        this.closeDeleteModal();
        this.loadQuizzes(this.formationId ?? 0);
      });
    }
  }

  openDetailsModal(quiz: Quiz): void {
    this.quiz = quiz;
   $('#detailsModel').modal('show');
  }

   closeDetailsModal() {
    $('#detailsModel').modal('hide');
  }

 
  openDetailsQuestionModal(question: Question): void {
    this.question = question;
   $('#detailsQuestionModel').modal('show');
  }
  
    closeDetailsQuestionModal() {
    $('#detailsQuestionModel').modal('hide');
  }

}
