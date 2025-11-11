// src/app/side-bar/side-bar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthAdminService } from '../auth-admin-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  isCollapsed = false;
  activeLink: string = '';
  user: any; // Store current user information

  @Output() toggle = new EventEmitter<boolean>();

  constructor(private router: Router, private authAdminService: AuthAdminService) {
    // Listen to route changes to update active link
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveLink(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    // Set active link on initial load
    this.setActiveLink(this.router.url);
    // Get current user info
    this.user = this.authAdminService.getCurrentUser();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed);
  }

  setActiveLink(link: string) {
    if (link.includes('/admin/gestion-formateur')) {
      this.activeLink = 'formateur';
    } else if (link.includes('/admin/dashboard')) {
      this.activeLink = 'dashboard';
    } else if (link.includes('/admin/gestion-utilisateur')) {
      this.activeLink = 'utilisateur';
    } else if (link.includes('/admin/gestion-formation')) {
      this.activeLink = 'formation';
    } else if (link.includes('/admin/acces')) {
      this.activeLink = 'codeacces';
    } else if (link.includes('/admin/email')) {
      this.activeLink = 'email';
    } else if (link.includes('/admin/gestionprojet')) {
      this.activeLink = 'projets';
    } else if (link.includes('/admin/feedback')) {
      this.activeLink = 'commentaire';
    } else if (link.includes('/admin/recrutement/candidatures')) {
      this.activeLink = 'candidatures';
    } else if (link.includes('logout')) {
      this.activeLink = 'logout';
    } else {
      this.activeLink = '';
    }
  }

  logout() {
    this.authAdminService.logout();
  }
}
