import { Component, OnInit } from '@angular/core';
import { FormationService } from '../formation.service';
import { Formation } from '../models/formation.model';
import { Router } from '@angular/router';
import { ImageFormationService } from '../image-formation.service';
import { AuthUserService } from '../auth-user-service.service';
export interface Card {
  id: number;
  image: string;
  category: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {
  isSidebarCollapsed: boolean = false;
  textVisible: boolean[] = [];
  cards: Card[] = []; // Utiliser l'interface Card
  imageMap: Map<number, { type: string, picByte: string }> = new Map<number, { type: string, picByte: string }>();
  user: any;

  constructor(
    private formationService: FormationService,
    private router: Router,
    private imageFormationService: ImageFormationService,
    private authUserService: AuthUserService
  ) { }

  ngOnInit(): void {
    this.loadFormations();
    this.user = this.authUserService.getCurrentUser();
  }

  private getImageUrl(image: { type: string, picByte: string } | undefined): string {
    if (image) {
      return 'data:' + image.type + ';base64,' + image.picByte;
    }
    return 'https://www.bootdey.com/image/350x350'; // Image par défaut
  }

  private loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (formations: Formation[]) => {
        // Préparer les cartes avec une image par défaut
        this.cards = formations.map(formation => ({
          id: formation.id,
          image: this.getImageUrl(this.imageMap.get(formation.id)),
          category: formation.title.toLowerCase(),
          title: formation.title,
          description: formation.content.substring(0, 100)
        }));

        // Charger les images après avoir récupéré les formations
        formations.forEach(formation => {
          this.imageFormationService.getImageByUserId(formation.id).subscribe(
            (response: { type: string, picByte: string }) => {  // Assurez-vous que `response` est de type { type: string, picByte: string }
              this.imageMap.set(formation.id, response);
              // Mettre à jour les cartes avec les images une fois chargées
              this.cards = this.cards.map(card => 
                card.id === formation.id ? { ...card, image: this.getImageUrl(response) } : card
              );
            },
            (error) => {
              console.error('Failed to retrieve image:', error);
            }
          );
        });
      },
      error: () => {
        console.error('Failed to load formations');
      }
    });
  }

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  showText(index: number): void {
    this.textVisible[index] = true;
  }

  hideText(index: number): void {
    this.textVisible[index] = false;
  }

  goToAccesPage(card: Card): void {
    this.router.navigate(['/user/formation', card.id]);
  }
  
  goToQuiz(formationId: number): void {
    this.router.navigate(['/user/quiz', formationId]);
  }
}
