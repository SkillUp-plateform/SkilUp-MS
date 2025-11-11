import { Component, OnInit } from '@angular/core';
import { CandidatureResponse, CandidatureStatus } from '../models/candidature.model';
import { RecrutementService } from '../recrutement/recrutement.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-candidature-list',
  templateUrl: './candidature-list.component.html',
  styleUrls: ['./candidature-list.component.css']
})
export class CandidatureListComponent implements OnInit {
  candidatures: CandidatureResponse[] = [];
  loading = false;
  error?: string;
  selectedStatus?: CandidatureStatus;
  statuses = Object.values(CandidatureStatus);
  userMap: Map<string, string> = new Map(); // Map Keycloak ID to username
  isSidebarCollapsed = false;

  constructor(
    private recrutement: RecrutementService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsersMap();
    this.fetch();
  }

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
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
        console.log('👥 User map loaded for candidatures:', this.userMap);
      },
      error => {
        console.error('Error loading users map:', error);
      }
    );
  }

  // Get username by Keycloak ID
  getUsernameById(keycloakId: string): string {
    return this.userMap.get(keycloakId) || keycloakId || 'Unknown';
  }

  fetch() {
    this.loading = true;
    this.error = undefined;
    this.recrutement.list(this.selectedStatus).subscribe({
      next: (list) => {
        this.candidatures = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur de chargement: ' + (err?.error?.message || err.statusText || 'inconnue');
        this.loading = false;
      }
    });
  }

  approve(id: number) {
    this.recrutement.approve(id).subscribe({
      next: () => this.fetch(),
      error: (err) => this.error = 'Erreur approbation: ' + (err?.error?.message || err.statusText || 'inconnue')
    });
  }

  reject(id: number) {
    this.recrutement.reject(id).subscribe({
      next: () => this.fetch(),
      error: (err) => this.error = 'Erreur rejet: ' + (err?.error?.message || err.statusText || 'inconnue')
    });
  }
}