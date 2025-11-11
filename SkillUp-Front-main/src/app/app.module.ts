import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { GestionFormateurComponent } from './gestion-formateur/gestion-formateur.component';
import { GestionUtilisateurComponent } from './gestion-utilisateur/gestion-utilisateur.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionFormationComponent } from './gestion-formation/gestion-formation.component';
import { GetionProjectComponent } from './getion-project/getion-project.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SideBarUserComponent } from './side-bar-user/side-bar-user.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { PaymentUserComponent } from './payment-user/payment-user.component';
import { AccesComponent } from './acces/acces.component';
import { SideBarFormateurComponent } from './side-bar-formateur/side-bar-formateur.component';
import { HomeFormateurComponent } from './home-formateur/home-formateur.component';
import { ProjetUserComponent } from './projet-user/projet-user.component';
import { FormationComponent } from './formation/formation.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HttpClientModule } from '@angular/common/http';
import { FormationForComponent } from './formation-for/formation-for.component';
import { FeedbackAdminComponent } from './feedback-admin/feedback-admin.component';
import { FormateurContactComponent } from './formateur-contact/formateur-contact.component';
import { AccesAdminComponent } from './acces-admin/acces-admin.component';
import { EmailComponent } from './email/email.component';
import { ImageComponent } from './image/image.component';
import { SigninFormateurComponent } from './signin-formateur/signin-formateur.component';
import { SigninAdminComponent } from './signin-admin/signin-admin.component';
import { SignupForComponent } from './signup-for/signup-for.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizUserComponent } from './quiz-user/quiz-user.component';
import { CandidatureSubmitComponent } from './recrutement/candidature-submit.component';
import { CandidatureFormComponent } from './candidature-form/candidature-form.component';
import { CandidatureListComponent } from './candidature-list/candidature-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    GestionFormateurComponent,
    GestionUtilisateurComponent,
    DashboardComponent,
    GestionFormationComponent,
    GetionProjectComponent,
    HomeComponent,
    HeaderComponent,
    SignInComponent,
    SignUpComponent,
    SideBarUserComponent,
    HomeUserComponent,
    PaymentUserComponent,
    AccesComponent,
    SideBarFormateurComponent,
    HomeFormateurComponent,
    ProjetUserComponent,
    FormationComponent,
    FeedbackComponent,
    FormationForComponent,
    FeedbackAdminComponent,
    FormateurContactComponent,
    AccesAdminComponent,
    EmailComponent,
    ImageComponent,
    SigninFormateurComponent,
    SigninAdminComponent,
    SignupForComponent,
    QuizComponent,
    QuizUserComponent,    
    CandidatureSubmitComponent,
    CandidatureFormComponent,
    CandidatureListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
