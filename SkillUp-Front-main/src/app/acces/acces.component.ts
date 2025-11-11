import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessCodeService } from '../acces-code.service'; // Importer le service
import { AccessCode } from '../models/accessCode.model'; // Importer le modèle

@Component({
  selector: 'app-acces',
  templateUrl: './acces.component.html',
  styleUrls: ['./acces.component.css']
})
export class AccesComponent implements OnInit {
  accessCode: string = ''; // Code d'accès saisi par l'utilisateur
  isSidebarCollapsed: boolean = false;
  loginError: string = ""; // Ajoutez cette propriété

  constructor(private router: Router, private accessCodeService: AccessCodeService) {} // Injecter le service

  ngOnInit(): void {}

  submit() {
    this.accessCodeService.getAllAccessCodes().subscribe(
      (accessCodes: AccessCode[]) => {
        const foundCode = accessCodes.find(ac => ac.code === this.accessCode);

        if (foundCode) {
          // Rediriger vers la page de formation correspondante
          this.router.navigate([`/formation/${foundCode.formation.id}`]);
        } else {
          // Afficher un message d'erreur si le code est incorrect
          this.loginError = "Code incorrect. Veuillez réessayer. !";
        }
      },
      (error) => {
        console.error('Erreur lors de la vérification du code d\'accès:', error);
        this.loginError = "Une erreur est survenue. Veuillez réessayer plus tard."; // Définir le message d'erreur

      }
    );
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
