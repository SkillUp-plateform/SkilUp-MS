import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideBarComponent } from './side-bar/side-bar.component';
import { GestionFormateurComponent } from './gestion-formateur/gestion-formateur.component';
import { GestionUtilisateurComponent } from './gestion-utilisateur/gestion-utilisateur.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionFormationComponent } from './gestion-formation/gestion-formation.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { GetionProjectComponent } from './getion-project/getion-project.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { PaymentUserComponent } from './payment-user/payment-user.component';
import { SideBarUserComponent } from './side-bar-user/side-bar-user.component';
import { HomeFormateurComponent } from './home-formateur/home-formateur.component';
import { AccesComponent } from './acces/acces.component';
import { ProjetUserComponent } from './projet-user/projet-user.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FormationComponent } from './formation/formation.component';
import { FormationForComponent } from './formation-for/formation-for.component';
import { FormateurContactComponent } from './formateur-contact/formateur-contact.component';
import { FeedbackAdminComponent } from './feedback-admin/feedback-admin.component';
import { AccesAdminComponent } from './acces-admin/acces-admin.component';
import { EmailComponent } from './email/email.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { SigninFormateurComponent } from './signin-formateur/signin-formateur.component';
import { SigninAdminComponent } from './signin-admin/signin-admin.component';
import { SignupForComponent } from './signup-for/signup-for.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizUserComponent } from './quiz-user/quiz-user.component';
import { CandidatureSubmitComponent } from './recrutement/candidature-submit.component';
import { CandidatureFormComponent } from './candidature-form/candidature-form.component';
import { CandidatureListComponent } from './candidature-list/candidature-list.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'signinFor', component: SigninFormateurComponent },
  { path: 'signinAdmin', component: SigninAdminComponent },
  { path: 'signupFor', component: SignupForComponent },
  
  // Admin routes
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'ADMIN'] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'gestion-formateur', component: GestionFormateurComponent },
      { path: 'gestion-utilisateur', component: GestionUtilisateurComponent },
      { path: 'gestion-formation', component: GestionFormationComponent },
      { path: 'gestionprojet', component: GetionProjectComponent },
      { path: 'feedback', component: FeedbackAdminComponent },
      { path: 'acces', component: AccesAdminComponent },
      { path: 'email', component: EmailComponent },
      { path: 'recrutement/candidatures', component: CandidatureListComponent }
    ]
  },
  
  // Formateur routes
  {
    path: 'formateur',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['formateur', 'FORMATEUR'] },
    children: [
      { path: 'home', component: HomeFormateurComponent },
      { path: 'formation/:id', component: FormationForComponent },
      { path: 'add-quiz/:formationId', component: QuizComponent },
      { path: 'formateur-contact', component: FormateurContactComponent },
      { path: 'feedback', component: FeedbackComponent }
    ]
  },
  
  // User routes
  {
    path: 'user',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user', 'USER', 'default-roles-my-app-realm'] },
    children: [
      { path: 'home', component: HomeUserComponent },
      { path: 'formation/:id', component: FormationComponent },
      { path: 'quiz/:formationId', component: QuizUserComponent },
      { path: 'projets', component: ProjetUserComponent },
      { path: 'payment', component: PaymentUserComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'formateur-contact', component: FormateurContactComponent },
      { path: 'acces/:id', component: AccesComponent },
      { path: 'recrutement/submit', component: CandidatureSubmitComponent },
      { path: 'recrutement/form', component: CandidatureFormComponent }
    ]
  },
  
  // Fallback route
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
