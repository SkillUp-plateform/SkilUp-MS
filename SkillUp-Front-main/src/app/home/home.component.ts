import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from '../feedback.service'; // Adjust the import path
import { Feedback } from '../models/feedback.model';

import { UserService } from '../user.service';
import { FormateurService } from '../formateur.service';
import { ProjectService } from '../project.service';
import { FormationService } from '../formation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute,private feedbackService: FeedbackService,private userService: UserService,
    private formateurService: FormateurService,
    private projetService: ProjectService,
    private formationService: FormationService) { }

    
    numberOfProjects: number = 0;
    numberOfTrainers: number = 0;
    numberOfUsers: number = 0;
    numberOfFormations: number = 0;
  comments: Feedback[] = [];
  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
    this.loadFeedbacks();
    this.getDashboardData();
  
  }
  loadFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => this.comments = data,
      error: (err) => console.error('Failed to load feedbacks', err)
    });
  }

  getDashboardData() {
    this.userService.getAllUsers().subscribe(users => {
      this.numberOfUsers = users.length;
    });

    this.formateurService.getAllFormateur().subscribe(formateurs => {
      this.numberOfTrainers = formateurs.length;
    });

    this.projetService.getAllProjects().subscribe(projects => {
      this.numberOfProjects = projects.length;
    });

    this.formationService.getAllFormations().subscribe(formations => {
      this.numberOfFormations = formations.length;
    });

  }

  
  

  
}

