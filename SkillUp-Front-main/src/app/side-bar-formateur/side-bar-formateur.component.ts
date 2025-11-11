import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthFormateurService } from '../auth-formateur-service.service'; // Assurez-vous que ce chemin est correct

@Component({
  selector: 'app-side-bar-formateur',
  templateUrl: './side-bar-formateur.component.html',
  styleUrls: ['./side-bar-formateur.component.css']
})
export class SideBarFormateurComponent {
  isCollapsed = false;
  activeLink: string = '';
  user: any; // Remplacez 'any' par le type approprié si vous en avez un

  @Output() toggle = new EventEmitter<boolean>();

  constructor(private router: Router,private authFormateurService: AuthFormateurService) {
    // Écouter les changements de route pour mettre à jour le lien actif
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveLink(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    // Définir le lien actif lors du chargement initial
    this.setActiveLink(this.router.url);
    this.user = this.authFormateurService.getCurrentUser();  }


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed);
  }

  setActiveLink(link: string) {
    if (link.includes('homeformateur')) {
      this.activeLink = 'home';
    } else if (link.includes('logout')) {
      this.activeLink = 'logout';
    } else {
      this.activeLink = '';
    }
  }
  logout() {
    this.authFormateurService.logout(); // Assurez-vous que cette méthode est définie dans votre service
  }
}
