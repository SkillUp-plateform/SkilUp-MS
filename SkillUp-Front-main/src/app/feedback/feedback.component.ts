import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FeedbackService } from '../feedback.service';
import { Feedback } from '../models/feedback.model';
import { User } from '../models/user.model'; // Import du modèle User
import { AuthUserService } from '../auth-user-service.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  comments: Feedback[] = [];
  user: any;
  userMap: Map<string, string> = new Map(); // Map Keycloak ID to username

  constructor(
    private feedbackService: FeedbackService, 
    private authUserService: AuthUserService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.authUserService.getCurrentUser(); 
    this.loadUsersMap();
    this.loadFeedbacks();
  }

  // Load all users and create a map of Keycloak ID to username
  loadUsersMap(): void {
    this.userService.getUsersByRole('user').subscribe(
      (users: any[]) => {
        users.forEach(user => {
          if (user.id && user.username) {
            this.userMap.set(user.id, user.username);
          }
        });
        console.log('👥 User map loaded:', this.userMap);
      },
      error => {
        console.error('Error loading users map:', error);
      }
    );
  }

  // Get username by Keycloak ID
  getUsernameById(keycloakId: string): string {
    return this.userMap.get(keycloakId) || keycloakId || 'User';
  }

  isSidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  // Charger les commentaires depuis l'API
  loadFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe(
      (feedbacks: Feedback[]) => {
        console.log('📋 Feedbacks loaded:', feedbacks);
        this.comments = feedbacks;
        
        // Debug each comment
        this.comments.forEach((comment, index) => {
          console.log(`Comment ${index + 1}:`, comment);
          console.log(`  - Content: ${comment.content}`);
          console.log(`  - User:`, comment.user);
          console.log(`  - Date: ${comment.date}`);
        });
      },
      error => {
        console.error('Erreur lors du chargement des feedbacks:', error);
      }
    );
  }

  submitComment(form: NgForm) {
    if (form.valid) {
      const newFeedback: Feedback = {
        content: form.value.commentText,
        user: this.user
      };
  
      console.log('Submitting comment:', newFeedback);
      console.log('Full user object:', this.user);
  
      // Check if user has Keycloak ID already
      let keycloakUserId = this.user?.keycloakId || this.user?.sub;
      
      if (keycloakUserId) {
        // If we already have Keycloak ID, submit directly
        console.log('Using existing Keycloak ID:', keycloakUserId);
        this.submitFeedbackWithKeycloakId(newFeedback, keycloakUserId, form);
      } else if (this.user?.username) {
        // Fetch Keycloak ID from user management service
        console.log('Fetching Keycloak ID for username:', this.user.username);
        
        this.userService.getKeycloakIdByUsername(this.user.username, 'user').subscribe(
          (fetchedKeycloakId) => {
            if (fetchedKeycloakId) {
              console.log('✅ Keycloak ID fetched:', fetchedKeycloakId);
              this.submitFeedbackWithKeycloakId(newFeedback, fetchedKeycloakId, form);
            } else {
              console.error('❌ No Keycloak ID found for username:', this.user.username);
              alert('Erreur: Impossible de trouver votre identifiant utilisateur.');
            }
          },
          error => {
            console.error('❌ Error fetching Keycloak ID:', error);
            alert('Erreur lors de la récupération de votre identifiant utilisateur.');
          }
        );
      } else {
        console.error('No username or Keycloak ID found. User object:', this.user);
        alert('Erreur: Impossible de soumettre le commentaire. Utilisateur non identifié.');
      }
    } else {
      console.warn('Form is not valid');
    }
  }

  private submitFeedbackWithKeycloakId(feedback: Feedback, keycloakUserId: string, form: NgForm) {
    console.log('📤 Submitting feedback with Keycloak ID:', keycloakUserId);
    
    this.feedbackService.addFeedback(feedback, keycloakUserId).subscribe(
      (savedFeedback: Feedback) => {
        console.log('✅ Comment submitted successfully:', savedFeedback);
        
        // Add the submitted comment to the list
        this.comments.push(savedFeedback);
        
        // Reset form
        form.reset();
        
        alert('Commentaire ajouté avec succès!');
      },
      error => {
        console.error('❌ Error submitting comment:', error);
        alert('Erreur lors de l\'ajout du commentaire. Veuillez réessayer.');
      }
    );
  }
  

}
