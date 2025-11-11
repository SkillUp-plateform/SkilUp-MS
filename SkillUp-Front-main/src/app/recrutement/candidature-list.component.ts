import { Component, OnInit } from '@angular/core';
import { CandidatureResponse, CandidatureStatus } from '../models/candidature.model';
import { RecrutementService } from './recrutement.service';
import { UserService } from '../user.service';
import { User } from '../models/user.model';
import { FormateurService } from '../formateur.service';
import { Formateur } from '../models/formateur.model';

@Component({
  selector: 'app-candidature-list',
  templateUrl: './candidature-list.component.html',
  styleUrls: ['./candidature-list.component.css']
})
export class CandidatureListComponent implements OnInit {
  candidatures: CandidatureResponse[] = [];
  loading = false;
  error?: string;

  public readonly CandidatureStatus = CandidatureStatus;
  selectedStatus?: CandidatureStatus;
  statuses = Object.values(CandidatureStatus);

  ngOnInit(): void {
    this.load();
  }

  onStatusChange(value: string): void {
    this.selectedStatus = value ? (value as CandidatureStatus) : undefined;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.recrutementService.list(this.selectedStatus).subscribe({
      next: (list) => {
        this.candidatures = list;
        this.loading = false;
      },
      error: (err) => {
        if (err?.status === 0) {
          this.error = 'Service Recrutement inaccessible (CORS ou serveur arrêté).';
        } else {
          const msg = err?.error?.message || err?.statusText || 'Inconnu';
          this.error = 'Chargement impossible: ' + msg;
        }
        this.loading = false;
      }
    });
  }

  approve(id: number): void {
    this.recrutementService.approve(id).subscribe({
      next: () => this.load(),
      error: () => { this.error = 'Approbation échouée.'; }
    });
  }

  downloadCv(id: number): void {
    this.recrutementService.downloadCv(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.statusText || 'Inconnu';
        this.error = 'Téléchargement CV échoué: ' + msg;
      }
    });
  }
  reject(id: number): void {
    this.recrutementService.reject(id).subscribe({
      next: () => this.load(),
      error: () => {
        this.error = 'Rejet échoué.';
      }
    });
  }

  // Détails
  selectedCandidature?: CandidatureResponse;
  selectedUser?: User;
  detailLoading = false;
  detailError?: string;

  constructor(
    private recrutementService: RecrutementService,
    private userService: UserService,
    private formateurService: FormateurService
  ) {}

  openDetails(c: CandidatureResponse): void {
    this.selectedCandidature = c;
    this.selectedUser = undefined;
    this.detailError = undefined;
    this.detailLoading = true;

    this.userService.getUserById(c.userId).subscribe({
      next: (u) => {
        this.selectedUser = u;
        this.detailLoading = false;
      },
      error: (err) => {
        const msg = err?.error?.message || err?.statusText || 'Inconnu';
        this.detailError = 'Impossible de charger l’utilisateur: ' + msg;
        this.detailLoading = false;
      }
    });
  }

  closeDetails(): void {
    this.selectedCandidature = undefined;
    this.selectedUser = undefined;
    this.detailError = undefined;
    this.detailLoading = false;
  }
}